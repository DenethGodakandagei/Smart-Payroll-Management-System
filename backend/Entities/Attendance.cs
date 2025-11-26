using System.ComponentModel.DataAnnotations;

namespace SmartPayroll.Api.Entities
{
    public class Attendance
    {
        [Key]
        public int AttendanceId { get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }

        // store month as date (first day of month)
        public DateTime MonthYear { get; set; }
        public decimal WorkingHours { get; set; }
        public decimal OvertimeHours { get; set; }
        public int UnpaidLeaves { get; set; }
    }
}
