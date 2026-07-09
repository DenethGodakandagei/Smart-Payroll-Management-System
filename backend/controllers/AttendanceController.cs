using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartPayroll.Api.Data;
using SmartPayroll.Api.Entities;

namespace SmartPayroll.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,HRManager")]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public AttendanceController(ApplicationDbContext db) { _db = db; }

        [HttpPost]
        public async Task<IActionResult> AddAttendance([FromBody] AttendanceDto dto)
        {
            var att = new Attendance
            {
                EmployeeId = dto.EmployeeId,
                MonthYear = dto.MonthYear.Date,
                WorkingHours = dto.WorkingHours,
                OvertimeHours = dto.OvertimeHours,
                UnpaidLeaves = dto.UnpaidLeaves
            };
            _db.Attendances.Add(att);
            await _db.SaveChangesAsync();
            return Ok(att);
        }

        [HttpGet("{employeeId}/{monthYear}")]
        public async Task<IActionResult> GetForEmployee(int employeeId, DateTime monthYear)
        {
            var att = await _db.Attendances
                .Where(a => a.EmployeeId == employeeId && a.MonthYear == monthYear.Date)
                .FirstOrDefaultAsync();
            if (att == null) return NotFound();
            return Ok(att);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.Attendances
                .Include(a => a.Employee)
                .OrderByDescending(a => a.MonthYear)
                .ToListAsync();
            return Ok(list);
        }
    }
}
