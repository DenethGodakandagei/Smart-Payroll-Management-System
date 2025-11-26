using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SmartPayroll.Api.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SmartPayroll.Api.Utilities
{
    public static class JwtUtils
    {
        public static string GenerateJwtToken(Employee user, IConfiguration configuration)
        {
            var jwtSection = configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSection["ExpireMinutes"]));

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim("id", user.EmployeeId.ToString()),
                new Claim(ClaimTypes.Role, user.Role?.Name ?? "Employee"),
                new Claim("name", user.FullName)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
