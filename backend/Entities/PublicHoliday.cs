using System.ComponentModel.DataAnnotations;

namespace SmartPayroll.Api.Entities
{
    public class PublicHoliday
    {
        [Key]
        public int PublicHolidayId { get; set; }
        public DateTime HolidayDate { get; set; }
        public string Name { get; set; }
    }
}
