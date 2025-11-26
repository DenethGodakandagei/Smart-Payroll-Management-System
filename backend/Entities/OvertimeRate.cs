using System.ComponentModel.DataAnnotations;

namespace SmartPayroll.Api.Entities
{
    public class OvertimeRate
    {
        [Key]
        public int OvertimeRateId { get; set; }
        public string DayType { get; set; } // e.g., "Weekday","Weekend","Holiday"
        public decimal Multiplier { get; set; }
    }
}
