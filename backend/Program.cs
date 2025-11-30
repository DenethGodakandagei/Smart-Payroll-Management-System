using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartPayroll.Api.Data;
using SmartPayroll.Api.Middleware;
using SmartPayroll.Api.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Fix timestamp behavior for Npgsql
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Add DbContext (Neon PostgreSQL)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPayrollService, PayrollService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure JWT
var jwtSection = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSection["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSection["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSection["Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // Prevents token expiry delays
    };
});

var app = builder.Build();

// Auto apply EF migrations (IMPORTANT: works with Neon)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate(); // Creates tables and applies migrations automatically
}

// Development tools
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middlewares (correct order)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

// Optional: Your custom middleware
app.UseMiddleware<AuditMiddleware>();

app.MapControllers();

app.Run();
