using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartPayroll.Api.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPayroll.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,HRManager")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public DashboardController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var activeEmployees = await _db.Employees.CountAsync(e => e.IsActive);

            var today = DateTime.UtcNow;
            var sixMonthsAgo = new DateTime(today.Year, today.Month, 1).AddMonths(-5);

            var payrolls = await _db.Payrolls
                .Where(p => p.MonthYear >= sixMonthsAgo)
                .ToListAsync();

            // Group salary trend by month
            var trend = Enumerable.Range(0, 6)
                .Select(i => sixMonthsAgo.AddMonths(i))
                .Select(month => {
                    var monthPayrolls = payrolls.Where(p => p.MonthYear.Year == month.Year && p.MonthYear.Month == month.Month);
                    return new {
                        Month = month.ToString("MMM yyyy"),
                        TotalNet = monthPayrolls.Sum(p => p.NetSalary),
                        TotalGross = monthPayrolls.Sum(p => p.GrossSalary)
                    };
                }).ToList();

            // Statutory breakdown of the most recent cycle
            var latestCycleDate = payrolls.OrderByDescending(p => p.MonthYear).Select(p => (DateTime?)p.MonthYear).FirstOrDefault();
            
            decimal totalEpf = 0;
            decimal totalEtf = 0;
            decimal totalTax = 0;
            decimal totalNet = 0;

            if (latestCycleDate.HasValue)
            {
                var latestPayrolls = payrolls.Where(p => p.MonthYear == latestCycleDate.Value);
                totalEpf = latestPayrolls.Sum(p => p.Epf);
                totalEtf = latestPayrolls.Sum(p => p.Etf);
                totalTax = latestPayrolls.Sum(p => p.Tax);
                totalNet = latestPayrolls.Sum(p => p.NetSalary);
            }

            return Ok(new {
                ActiveEmployees = activeEmployees,
                LatestCycle = latestCycleDate.HasValue ? latestCycleDate.Value.ToString("MMMM yyyy") : "N/A",
                Breakdown = new {
                    Epf = totalEpf,
                    Etf = totalEtf,
                    Tax = totalTax,
                    Net = totalNet
                },
                Trend = trend
            });
        }
    }
}
