using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SmartPayroll.Api.Data;
using SmartPayroll.Api.Entities;
using System.IO;
using System.Text;
using System.Text.Json;

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
            // For demo: log POST/PUT/DELETE payloads to AuditLog
            if (context.Request.Method == HttpMethods.Post ||
                context.Request.Method == HttpMethods.Put ||
                context.Request.Method == HttpMethods.Delete)
            {
                context.Request.EnableBuffering();
                using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
                var body = await reader.ReadToEndAsync();
                context.Request.Body.Position = 0;

                var log = new AuditLog
                {
                    TableName = context.Request.Path,
                    RecordId = Guid.NewGuid().ToString(),
                    FieldChanged = context.Request.Method,
                    OldValue = null,
                    NewValue = body,
                    ChangedByUserId = context.User?.FindFirst("id")?.Value != null ? int.Parse(context.User.FindFirst("id").Value) : (int?)null,
                    Timestamp = DateTime.UtcNow
                };

                db.AuditLogs.Add(log);
                await db.SaveChangesAsync();
            }

            await _next(context);
        }
    }
}
