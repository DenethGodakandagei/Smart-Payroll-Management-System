using SmartPayroll.Api.Entities;

namespace SmartPayroll.Api.Services
{
    public interface IPayrollService
    {
        Task<Payroll> GeneratePayrollForEmployee(int employeeId, DateTime monthYear);
        Task<IEnumerable<Payroll>> GeneratePayrollForAllActiveEmployees(DateTime monthYear);
        Task FinalizePayroll(int payrollId);
    }
}
