using System.ComponentModel.DataAnnotations;

namespace SmartPayroll.Api.Entities
{
    public class AuditLog
    {
        [Key]
        public int LogId { get; set; }

        public string TableName { get; set; }   // Employees, Attendance, Payroll, etc.
        public string RecordId { get; set; }    // Changed record primary key

        public string FieldChanged { get; set; } // Name of the field updated
        public string OldValue { get; set; }     // Before change
        public string NewValue { get; set; }     // After change

        public int? ChangedByUserId { get; set; }  // User who made the change 

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
