using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SmartPayroll.Api.Data;
using SmartPayroll.Api.Entities;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Security.Claims; // Added for clarity on Claims

namespace SmartPayroll.Api.Middleware
{
    public class AuditMiddleware
    {
        private readonly RequestDelegate _next;

        public AuditMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, ApplicationDbContext db)
        {
            // Only log for operations that change data
            if (context.Request.Method == HttpMethods.Post ||
                context.Request.Method == HttpMethods.Put ||
                context.Request.Method == HttpMethods.Delete)
            {
                // Ensure the request body can be read, and then reset
                context.Request.EnableBuffering();
                string body;

                // Read the request body
                using (var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true))
                {
                    body = await reader.ReadToEndAsync();
                    // Reset the position for the next middleware/controller to read it
                    context.Request.Body.Position = 0;
                }
                
                // --- User ID Extraction ---
                int? changedByUserId = null;
                var userIdClaim = context.User?.FindFirst("id")?.Value;
                if (int.TryParse(userIdClaim, out int userId))
                {
                    changedByUserId = userId;
                }
                // --------------------------

                var log = new AuditLog
                {
                    TableName = context.Request.Path, // Path is used as TableName (e.g., /api/employees)
                    RecordId = Guid.NewGuid().ToString(), // A new GUID is used for the log record itself
                    FieldChanged = context.Request.Method,
                    
                    // --- ❌ FIX: This must be an empty string, not null ---
                    // This satisfies the 'NOT NULL' constraint in the database.
                    OldValue = string.Empty, 
                    
                    NewValue = body,
                    ChangedByUserId = changedByUserId,
                    Timestamp = DateTime.UtcNow
                };

                db.AuditLogs.Add(log);

                try
                {
                    // This save will now succeed because OldValue is an empty string
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    // Log the exception if the audit logging itself fails, but don't stop the main request
                    // You might want to use a proper logging framework here.
                    Console.WriteLine($"Audit logging failed: {ex.InnerException?.Message ?? ex.Message}");
                }
            }

            await _next(context);
        }
    }
}