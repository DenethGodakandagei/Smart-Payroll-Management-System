using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartPayroll.Api.Data;
using SmartPayroll.Api.Entities;

namespace SmartPayroll.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,HRManager")]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public EmployeesController(ApplicationDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.Employees.Include(e => e.Role).ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var emp = await _db.Employees.FindAsync(id);
            if (emp == null) return NotFound();
            return Ok(emp);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
        {
            var service = new AuthService(_db); // reuse register logic or inject IAuthService
            var created = await service.Register(dto);
            return CreatedAtAction(nameof(Get), new { id = created.EmployeeId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateEmployeeDto dto)
        {
            var emp = await _db.Employees.FindAsync(id);
            if (emp == null) return NotFound();
            emp.FullName = dto.FullName;
            emp.Designation = dto.Designation;
            emp.BasicSalary = dto.BasicSalary;
            emp.BankAccountNo = dto.BankAccountNo;
            emp.JoiningDate = dto.JoiningDate;
            emp.RoleId = dto.RoleId;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var emp = await _db.Employees.FindAsync(id);
            if (emp == null) return NotFound();
            _db.Employees.Remove(emp);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
