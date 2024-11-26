using alraed.Core.Entities;
using alraed.Core.interfaces;
using alraed.Core.Service;
using alraed.infrastructure.DatabaseContext;
using alraed.infrastructure.Repositries;
using alraed.infrastructure.Repositries.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using System.Text;


namespace alraed.infrastructure
{
    public static class infrastructureRegistration
    {
        public static IServiceCollection infrastructureConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseLazyLoadingProxies()
                       .UseSqlServer(configuration.GetConnectionString("alraed"), sqlOptions =>
                       {
                           sqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null); // Automatic retry for transient errors
                           sqlOptions.CommandTimeout(30); // Set command timeout for long-running queries
                       });
            });

            services.AddIdentity<AppUser, IdentityRole>(options =>
            {
                // Security enhancements for passwords
                options.Password.RequireDigit = true;
                options.Password.RequireNonAlphanumeric = true; // At least one special character
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.Password.RequiredLength = 12; // Increase minimum password length
                options.Password.RequiredUniqueChars = 3;

                // Account lockout settings
                options.Lockout.MaxFailedAccessAttempts = 5; // Allow up to 5 failed attempts
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15); // Lockout duration
                options.Lockout.AllowedForNewUsers = true;

                // User settings
                options.SignIn.RequireConfirmedEmail = true;
                options.SignIn.RequireConfirmedPhoneNumber = false; // Adjust based on business needs

                // Token lifespan for added security
                options.Tokens.PasswordResetTokenProvider = "Default";
                options.Tokens.EmailConfirmationTokenProvider = "Default";
            })



            .AddDefaultTokenProviders() // Default providers for token generation
            .AddEntityFrameworkStores<AppDbContext>();

            // Dependency injection for authentication service
            services.AddScoped<IAuth, Auth>();
            services.AddScoped<IGenerateToken, GenerateToken>();
            services.AddSingleton<IEmailService, EmailService>();
            // Configure Memory Cache with advanced settings
            services.AddMemoryCache(options =>
            {
                options.SizeLimit = 5000; // Increase size limit for larger cache capacity
                options.ExpirationScanFrequency = TimeSpan.FromHours(12); // Adjust scan frequency
                options.TrackStatistics = true; // Enable tracking for debugging and monitoring
            });

            // Configure Redis as a distributed cache for scalability
            //services.AddSingleton<IConnectionMultiplexer>(_ =>
            //{
            //    var redisConfig = ConfigurationOptions.Parse(configuration.GetConnectionString("redis"));
            //    redisConfig.AbortOnConnectFail = false; // Ensure the application doesn't crash on initial connection failure
            //    redisConfig.ConnectRetry = 5; // Retry up to 5 times
            //    redisConfig.KeepAlive = 180; // Maintain connection for 3 minutes
            //    //redisConfig.ReconnectRetryPolicy = new ExponentialRetry(TimeSpan.FromSeconds(2));
            //    return ConnectionMultiplexer.Connect(redisConfig);
            //});


            // CORS configuration
            services.AddCors(options =>
            {
                options.AddPolicy("CORSPolicy",
                builder =>
                {
                    builder.WithOrigins("http://localhost:4200", "https://localhost:4200")
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials();
                });
            });


            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
.AddCookie(x =>
{
    x.Cookie.Name = "token";
    x.Cookie.HttpOnly = true; // Ensures cookie is only accessible through HTTP
    x.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Ensures cookie is only sent over HTTPS
    x.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = true; // Require HTTPS in production
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("Secret"))),
        ValidateIssuer = true,
        ValidIssuer = Environment.GetEnvironmentVariable("Issuer"),
        ValidateAudience = true, // Enable audience validation
        ValidAudience = Environment.GetEnvironmentVariable("Audience"), // Set Audience
        ClockSkew = TimeSpan.Zero
    };
    x.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Cookies["token"];
            context.Token = token;
            return Task.CompletedTask;
        }
    };
});


            return services;
        }
    }
}
