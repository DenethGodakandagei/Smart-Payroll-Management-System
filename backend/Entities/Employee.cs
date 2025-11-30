using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartPayroll.Api.Entities
{
    public class Employee
    {
        [Key]
        public int EmployeeId { get; set; }

        [Required, MaxLength(200)]
        public string FullName { get; set; }

        [Required, MaxLength(200)]
        public string Email { get; set; }

        [MaxLength(20)]
        public string Nic { get; set; } 

        [MaxLength(50)]
        public string MemberNo { get; set; }  

        public string Designation { get; set; }

        [Column(TypeName = "numeric")]
        public decimal BasicSalary { get; set; }

        public string BankAccountNo { get; set; }

        public DateTime JoiningDate { get; set; }

        public int RoleId { get; set; }
        public Role Role { get; set; }

        // optional auth fields (for simple example)
        public string PasswordHash { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
