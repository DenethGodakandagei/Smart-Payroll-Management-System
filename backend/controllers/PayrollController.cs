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
    }
}
