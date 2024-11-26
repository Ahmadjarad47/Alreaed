using alraed.Core.DTOs.AuthDto;

namespace alraed.Core.interfaces
{
    public interface IAuth
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> ActiveUserAsync(ActiveRequest request);
        Task<AuthResponse> ResetPassword(ResetPasswordRequest request);

    }
}
