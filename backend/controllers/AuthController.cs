using Microsoft.AspNetCore.Mvc;
using SmartPayroll.Api.Services;
using SmartPayroll.Api.Utilities;

namespace SmartPayroll.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;
        private readonly IConfiguration _config;

        public AuthController(IAuthService auth, IConfiguration config)
        {
            _auth = auth;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateEmployeeDto dto)
        {
            try
            {
                var user = await _auth.Register(dto);
                return Ok(new { user.EmployeeId, user.Email });
            }
            catch (System.InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _auth.Authenticate(req.Email, req.Password);
            if (user == null) return Unauthorized("Invalid credentials");
            var token = JwtUtils.GenerateJwtToken(user, _config);
            return Ok(new { token });
        }
    }

    public record LoginRequest(string Email, string Password);
}
