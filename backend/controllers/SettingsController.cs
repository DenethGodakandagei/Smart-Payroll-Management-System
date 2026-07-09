using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace SmartPayroll.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,HRManager")]
    public class SettingsController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _env;

        public SettingsController(IConfiguration config, IWebHostEnvironment env)
        {
            _config = config;
            _env = env;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var epf = _config.GetValue<decimal>("Payroll:EpfPercent");
            var etf = _config.GetValue<decimal>("Payroll:EtfPercent");
            var tax = _config.GetValue<decimal>("Payroll:TaxPercent");

            return Ok(new { EpfPercent = epf, EtfPercent = etf, TaxPercent = tax });
        }

        [HttpPost]
        public async Task<IActionResult> Update([FromBody] UpdateSettingsDto dto)
        {
            var path = Path.Combine(_env.ContentRootPath, "appsettings.json");
            if (!System.IO.File.Exists(path)) return NotFound("appsettings.json not found");

            var jsonString = await System.IO.File.ReadAllTextAsync(path);
            var jsonObj = JsonSerializer.Deserialize<JsonNode>(jsonString);

            if (jsonObj != null)
            {
                var payrollNode = jsonObj["Payroll"] ?? new JsonObject();
                payrollNode["EpfPercent"] = dto.EpfPercent;
                payrollNode["EtfPercent"] = dto.EtfPercent;
                payrollNode["TaxPercent"] = dto.TaxPercent;
                jsonObj["Payroll"] = payrollNode;

                var options = new JsonSerializerOptions { WriteIndented = true };
                var updatedJson = JsonSerializer.Serialize(jsonObj, options);
                await System.IO.File.WriteAllTextAsync(path, updatedJson);
            }

            return Ok(dto);
        }
    }

    public class UpdateSettingsDto
    {
        public decimal EpfPercent { get; set; }
        public decimal EtfPercent { get; set; }
        public decimal TaxPercent { get; set; }
    }
}
