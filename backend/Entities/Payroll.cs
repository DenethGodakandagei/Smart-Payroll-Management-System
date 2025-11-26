using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartPayroll.Api.Entities
{
    public class Payroll
    {
        [Key]
        public int PayrollId { get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }

        public DateTime MonthYear { get; set; }

        [Column(TypeName = "numeric")]
        public decimal BasicPay { get; set; }

        [Column(TypeName = "numeric")]
        public decimal OtPay { get; set; }

        [Column(TypeName = "numeric")]
        public decimal GrossSalary { get; set; }

        [Column(TypeName = "numeric")]
        public decimal Epf { get; set; }

        [Column(TypeName = "numeric")]
        public decimal Etf { get; set; }

        [Column(TypeName = "numeric")]
        public decimal Tax { get; set; }

        [Column(TypeName = "numeric")]
        public decimal NetSalary { get; set; }

        public bool IsFinalized { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
