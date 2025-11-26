using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartPayroll.Api.Data;
using SmartPayroll.Api.Entities;
using SmartPayroll.Api.Services;

namespace SmartPayroll.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,HRManager")]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IAuthService _auth;

        public EmployeesController(ApplicationDbContext db, IAuthService auth)
        {
            _db = db;
            _auth = auth;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.Employees
                .Include(e => e.Role)
                .ToListAsync();

            return Ok(list);
        }

        // GET: api/employees/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var emp = await _db.Employees.FindAsync(id);
            if (emp == null) return NotFound();
            return Ok(emp);
        }

        // POST: api/employees
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
        {
            var created = await _auth.Register(dto);  // use DI service
            return CreatedAtAction(nameof(Get), new { id = created.EmployeeId }, created);
        }

        // PUT: api/employees/5
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

        // DELETE: api/employees/5
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
