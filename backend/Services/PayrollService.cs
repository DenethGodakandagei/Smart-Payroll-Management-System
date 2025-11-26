using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SmartPayroll.Api.Data;
using SmartPayroll.Api.Entities;

namespace SmartPayroll.Api.Services
{
    public class PayrollService : IPayrollService
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;

        public PayrollService(ApplicationDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<Payroll> GeneratePayrollForEmployee(int employeeId, DateTime monthYear)
        {
            var emp = await _db.Employees.FindAsync(employeeId);
            if (emp == null) throw new Exception("Employee not found");

            // get attendance for that employee & month
            var attendance = await _db.Attendances
                .Where(a => a.EmployeeId == employeeId && a.MonthYear == monthYear.Date)
                .FirstOrDefaultAsync();

            decimal basic = emp.BasicSalary;
            decimal otPay = 0m;
            if (attendance != null && attendance.OvertimeHours > 0)
            {
                // simple hourly rate: BasicSalary / (30 days * 8 hours) approximate
                var hourly = basic / (30m * 8m);
                // default multiplier 1.5
                var multiplier = 1.5m;
                // try lookup day-type multiplier (not applied per-day here, but can be enhanced)
                var rate = await _db.OvertimeRates.FirstOrDefaultAsync();
                if (rate != null) multiplier = rate.Multiplier;
                otPay = attendance.OvertimeHours * hourly * multiplier;
            }

            decimal gross = basic + otPay;

            // statutory percentages from config
            var epfPercent = _config.GetValue<decimal>("Payroll:EpfPercent");
            var etfPercent = _config.GetValue<decimal>("Payroll:EtfPercent");
            var taxPercent = _config.GetValue<decimal>("Payroll:TaxPercent");

            decimal epf = Math.Round(basic * epfPercent / 100m, 2);
            decimal etf = Math.Round(basic * etfPercent / 100m, 2);
            decimal tax = Math.Round(gross * taxPercent / 100m, 2);

            decimal net = gross - (epf + etf + tax);

            var payroll = new Payroll
            {
                EmployeeId = emp.EmployeeId,
                MonthYear = monthYear.Date,
                BasicPay = basic,
                OtPay = otPay,
                GrossSalary = gross,
                Epf = epf,
                Etf = etf,
                Tax = tax,
                NetSalary = net,
                IsFinalized = false
            };

            _db.Payrolls.Add(payroll);
            await _db.SaveChangesAsync();
            return payroll;
        }

        public async Task<IEnumerable<Payroll>> GeneratePayrollForAllActiveEmployees(DateTime monthYear)
        {
            var emps = await _db.Employees.Where(e => e.IsActive).ToListAsync();
            var results = new List<Payroll>();
            foreach (var e in emps)
            {
                var p = await GeneratePayrollForEmployee(e.EmployeeId, monthYear);
                results.Add(p);
            }
            return results;
        }

        public async Task FinalizePayroll(int payrollId)
        {
            var p = await _db.Payrolls.FindAsync(payrollId);
            if (p == null) throw new Exception("Payroll not found");
            p.IsFinalized = true;
            await _db.SaveChangesAsync();
        }
    }
}
