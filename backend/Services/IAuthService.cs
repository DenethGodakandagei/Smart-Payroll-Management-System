using SmartPayroll.Api.Entities;

namespace SmartPayroll.Api.Services
{
    public interface IAuthService
    {
        Task<Employee> Authenticate(string email, string password);
        Task<Employee> Register(CreateEmployeeDto dto);
    }
}
