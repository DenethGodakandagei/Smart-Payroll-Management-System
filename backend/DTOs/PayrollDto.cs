public class PayrollDto
{
    public int PayrollId { get; set; }
    public int EmployeeId { get; set; }
    public DateTime MonthYear { get; set; }
    public decimal BasicPay { get; set; }
    public decimal OtPay { get; set; }
    public decimal GrossSalary { get; set; }
    public decimal Epf { get; set; }
    public decimal Etf { get; set; }
    public decimal Tax { get; set; }
    public decimal NetSalary { get; set; }
    public bool IsFinalized { get; set; }
}
