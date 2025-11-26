using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartPayroll.Api.Services;

namespace SmartPayroll.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,HRManager")]
    public class PayrollController : ControllerBase
    {
        private readonly IPayrollService _payroll;
        public PayrollController(IPayrollService payroll) { _payroll = payroll; }

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
