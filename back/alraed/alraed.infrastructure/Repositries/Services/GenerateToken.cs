
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using alraed.Core.Entities;
using alraed.Core.Service;
using alraed.infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using alraed.infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Identity;
namespace alraed.infrastructure.Repositries.Services
{
    public class GenerateToken : IGenerateToken
    {
        private readonly UserManager<AppUser> _context;
        private readonly IConfiguration configuration;

        public GenerateToken(IConfiguration configuration, UserManager<AppUser> context)
        {
            this.configuration = configuration;
            _context = context;
        }
        public async Task<string> CreateToken(AppUser user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user), "User cannot be null");
            }

            // Validate user properties before use
            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.UserName))
            {
                throw new ArgumentException("User email or username is invalid");
            }

            // Assuming you have an injected DbContext for fetching user roles
            IList<string>? roles = await _context.GetRolesAsync(user);

            // Check if roles are empty or if none of the roles are in the predefined roles list
            if (roles == null || roles.Count == 0 || !roles.Any(role => Roles.AllRoles.Contains(role)))
            {
                throw new ArgumentException("User roles are invalid or not found in the defined roles");
            }

            // Proceed with adding the claims based on the first valid role
            var role = roles.FirstOrDefault(role => Roles.AllRoles.Contains(role));



            // Create claims with a strong set of claims
            List<Claim>? claims = new List<Claim>
              {
                  new Claim(ClaimTypes.Email, user.Email),
                  new Claim(ClaimTypes.Name, user.UserName),
                  new Claim("UserId", user.Id.ToString()), // Add user-specific information
                  new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Add unique JWT ID (JTI)
                  new Claim(JwtRegisteredClaimNames.Iss,  Environment.GetEnvironmentVariable("Issuer")),
                  new Claim(JwtRegisteredClaimNames.Aud,  Environment.GetEnvironmentVariable("Audience")), // Use Audience for added validation
                  new Claim(ClaimTypes.Role, role) // Add the role fetched from the database
              };

            string? secretKey = Environment.GetEnvironmentVariable("Secret");
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new InvalidOperationException("Token secret is not configured");
            }

            // Store the key securely
            byte[] key = Encoding.ASCII.GetBytes(secretKey);
            SigningCredentials? credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            // Expiration time: make this configurable via app settings
            int tokenExpirationHours = int.TryParse(DateTime.Now.AddDays(1).ToString(), out var expiration) ? expiration : 1;

            // Create the security token descriptor with enhanced properties
            SecurityTokenDescriptor? tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(tokenExpirationHours),
                NotBefore = DateTime.UtcNow, // Token is valid immediately
                Issuer = Environment.GetEnvironmentVariable("Issuer"),
                Audience = Environment.GetEnvironmentVariable("Audience"),
                SigningCredentials = credentials
            };

            // Handle token creation securely
            JwtSecurityTokenHandler? tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken? token = tokenHandler.CreateToken(tokenDescriptor);
            string? tokenString = tokenHandler.WriteToken(token);

            // Log token generation details securely (make sure to redact sensitive information in production)
            Console.WriteLine($"Generated JWT for {user.UserName} with Expiry: {tokenDescriptor.Expires}");

            return tokenString;
        }

    }
}
