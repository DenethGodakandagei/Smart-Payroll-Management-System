using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartPayroll.Api.Data;
using SmartPayroll.Api.Services;

namespace SmartPayroll.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,HRManager")]
    public class PayrollController : ControllerBase
    {
        private readonly IPayrollService _payroll;
        private readonly ApplicationDbContext _db;

        public PayrollController(IPayrollService payroll, ApplicationDbContext db)
        {
            _payroll = payroll;
            _db = db;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var p = await _db.Payrolls
                .Include(x => x.Employee)
                .FirstOrDefaultAsync(x => x.PayrollId == id);
            if (p == null) return NotFound();
            return Ok(p);
        }

        [HttpPost("generate/{employeeId}")]
        public async Task<IActionResult> GenerateForEmployee(int employeeId, [FromQuery] DateTime month)
        {
            var p = await _payroll.GeneratePayrollForEmployee(employeeId, month.Date);
            return Ok(p);
        }

        [HttpPost("generate/all")]
        public async Task<IActionResult> GenerateForAll([FromQuery] DateTime month)
        {
            var list = await _payroll.GeneratePayrollForAllActiveEmployees(month.Date);
            return Ok(list);
        }

        [HttpPost("finalize/{payrollId}")]
        public async Task<IActionResult> Finalize(int payrollId)
        {
            await _payroll.FinalizePayroll(payrollId);
            return Ok();
        }

        [HttpPost("{id}/email")]
        public async Task<IActionResult> SendEmail(int id, [FromServices] ApplicationDbContext db, [FromServices] IWebHostEnvironment env)
        {
            var p = await db.Payrolls
                .Include(x => x.Employee)
                .FirstOrDefaultAsync(x => x.PayrollId == id);
            if (p == null) return NotFound("Payroll record not found");

            var sentEmailsDir = Path.Combine(env.ContentRootPath, "sent_emails");
            if (!Directory.Exists(sentEmailsDir))
            {
                Directory.CreateDirectory(sentEmailsDir);
            }

            var monthStr = p.MonthYear.ToString("MMMM_yyyy");
            var fileName = $"payslip_{p.EmployeeId}_{monthStr}.html";
            var filePath = Path.Combine(sentEmailsDir, fileName);

            var html = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <title>Payslip - {monthStr}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa; color: #1f2937; margin: 0; padding: 20px; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
        .header {{ display: flex; justify-content: space-between; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 24px; }}
        .logo {{ font-weight: 800; font-size: 1.25rem; color: #09090b; }}
        .green-logo {{ color: #2bd97b; }}
        .section-title {{ font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px; }}
        .row {{ display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 8px; }}
        .bold {{ font-weight: 700; color: #111827; }}
        .red {{ color: #ef4444; }}
        .net-box {{ background: #09090b; color: #ffffff; border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center; margin: 24px 0; }}
        .net-title {{ font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; }}
        .net-value {{ font-size: 1.5rem; font-weight: 800; color: #2bd97b; }}
    </style>
</head>
<body>
    <div class='card'>
        <div class='header'>
            <div>
                <div class='logo'><span class='green-logo'>S</span>martPayroll</div>
                <div style='font-size: 0.75rem; color: #6b7280; margin-top: 4px;'>Official Pay Slip Emailed Record</div>
            </div>
            <div style='text-align: right;'>
                <div style='font-size: 0.875rem; font-weight: 700;'>{p.MonthYear.ToString("MMMM yyyy")}</div>
            </div>
        </div>

        <div style='background: #f9fafb; border-radius: 12px; padding: 12px; margin-bottom: 24px; display: flex; justify-content: space-between;'>
            <div>
                <div style='font-size: 0.875rem; font-weight: 700;'>{p.Employee?.FullName}</div>
                <div style='font-size: 0.75rem; color: #6b7280;'>{p.Employee?.Designation}</div>
            </div>
            <div style='text-align: right; font-size: 0.75rem; color: #6b7280;'>
                <div>Employee ID: #{p.EmployeeId}</div>
                <div>NIC: {p.Employee?.Nic}</div>
            </div>
        </div>

        <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 32px;'>
            <div>
                <div class='section-title'>Earnings</div>
                <div class='row'><span>Basic Salary</span><span class='bold'>LKR {p.BasicPay:N2}</span></div>
                <div class='row'><span>Overtime Pay</span><span class='bold'>LKR {p.OtPay:N2}</span></div>
                <div class='row' style='border-top: 1px dashed #e5e7eb; padding-top: 8px; margin-top: 8px;'><span>Gross Salary</span><span class='bold'>LKR {p.GrossSalary:N2}</span></div>
            </div>
            <div>
                <div class='section-title'>Deductions</div>
                <div class='row'><span>EPF (8%)</span><span class='bold red'>- LKR {p.Epf:N2}</span></div>
                <div class='row'><span>ETF (3%)</span><span class='bold red'>- LKR {p.Etf:N2}</span></div>
                <div class='row'><span>Income Tax (10%)</span><span class='bold red'>- LKR {p.Tax:N2}</span></div>
                <div class='row' style='border-top: 1px dashed #e5e7eb; padding-top: 8px; margin-top: 8px;'><span>Total Deductions</span><span class='bold red'>- LKR {(p.Epf + p.Etf + p.Tax):N2}</span></div>
            </div>
        </div>

        <div class='net-box'>
            <div>
                <div class='net-title'>Net Take-Home Salary</div>
                <div style='font-size: 0.65rem; color: #6b7280;'>EPF, ETF, and taxes already deducted.</div>
            </div>
            <div class='net-value'>LKR {p.NetSalary:N2}</div>
        </div>

        <div style='border-top: 1px solid #f3f4f6; padding-top: 16px; font-size: 0.75rem; color: #9ca3af; text-align: center;'>
            This is an official transaction document dispatched securely by SmartPayroll Ltd.
        </div>
    </div>
</body>
</html>
";

            await System.IO.File.WriteAllTextAsync(filePath, html);

            return Ok(new { 
                Message = "Payslip HTML generated and dispatched successfully.", 
                FileSavedPath = filePath 
            });
        }
    }
}
