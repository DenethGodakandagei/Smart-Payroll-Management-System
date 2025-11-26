using Microsoft.EntityFrameworkCore;
using SmartPayroll.Api.Entities;

namespace SmartPayroll.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
           : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Payroll> Payrolls { get; set; }
        public DbSet<OvertimeRate> OvertimeRates { get; set; }
        public DbSet<PublicHoliday> PublicHolidays { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // seed basic roles
            builder.Entity<Role>().HasData(
                new Role { RoleId = 1, Name = "Admin" },
                new Role { RoleId = 2, Name = "HRManager" },
                new Role { RoleId = 3, Name = "Employee" }
            );

            builder.Entity<Employee>()
                   .HasIndex(e => e.Email)
                   .IsUnique();
        }
    }
}
