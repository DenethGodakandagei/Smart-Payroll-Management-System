public class AttendanceDto
{
    public int EmployeeId { get; set; }
    public DateTime MonthYear { get; set; }
    public decimal WorkingHours { get; set; }
    public decimal OvertimeHours { get; set; }
    public int UnpaidLeaves { get; set; }
}
