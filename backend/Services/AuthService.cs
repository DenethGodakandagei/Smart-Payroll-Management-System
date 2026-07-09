using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartPayroll.Api.Data;
using SmartPayroll.Api.Entities;
using SmartPayroll.Api.Utilities;
using SmartPayroll.Api.Services;
using System.Security.Cryptography;
using System.Text;

namespace SmartPayroll.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _db;
        public AuthService(ApplicationDbContext db) { _db = db; }

        public async Task<Employee> Authenticate(string email, string password)
        {
            var user = await _db.Employees.Include(e => e.Role).FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return null;
            if (!VerifyPasswordHash(password, user.PasswordHash)) return null;
            return user;
        }

        public async Task<Employee> Register(CreateEmployeeDto dto)
        {
            var existing = await _db.Employees.AnyAsync(e => e.Email == dto.Email);
            if (existing)
            {
                throw new InvalidOperationException("An employee with this email is already registered.");
            }

            var hashed = CreatePasswordHash(dto.Password);
            var emp = new Employee
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Nic = dto.Nic,           
                MemberNo = dto.MemberNo, 
                BasicSalary = dto.BasicSalary,
                BankAccountNo = dto.BankAccountNo,
                Designation = dto.Designation,
                JoiningDate = dto.JoiningDate,
                RoleId = dto.RoleId,
                PasswordHash = hashed
            };
            _db.Employees.Add(emp);
            await _db.SaveChangesAsync();
            return emp;
        }

        // Very simple hashing for demo — replace with proper identity in production
        private string CreatePasswordHash(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private bool VerifyPasswordHash(string password, string storedHash)
        {
            var computed = CreatePasswordHash(password);
            return computed == storedHash;
        }
    }
}
