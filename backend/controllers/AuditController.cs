using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartPayroll.Api.Data;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPayroll.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,HRManager")]
    public class AuditController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public AuditController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _db.AuditLogs
                .OrderByDescending(l => l.Timestamp)
                .Take(100)
                .ToListAsync();

            var employeeIds = logs
                .Where(l => l.ChangedByUserId.HasValue)
                .Select(l => l.ChangedByUserId.Value)
                .Distinct()
                .ToList();

            var employees = await _db.Employees
                .Where(e => employeeIds.Contains(e.EmployeeId))
                .ToDictionaryAsync(e => e.EmployeeId, e => e.FullName);

            var result = logs.Select(l => new {
                l.LogId,
                l.TableName,
                l.RecordId,
                l.FieldChanged,
                l.OldValue,
                l.NewValue,
                l.Timestamp,
                ChangedBy = l.ChangedByUserId.HasValue && employees.ContainsKey(l.ChangedByUserId.Value) 
                    ? employees[l.ChangedByUserId.Value] 
                    : "System"
            });

            return Ok(result);
        }
    }
}
