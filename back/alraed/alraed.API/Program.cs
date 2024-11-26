using alraed.infrastructure;
using alraed.infrastructure.Configuration.Seed;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.ResponseCompression;
using Scalar.AspNetCore;
using System.Reflection;
using System.Threading.RateLimiting;
namespace alraed.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            infrastructureRegistration.infrastructureConfiguration(builder.Services, builder.Configuration);
            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddFluentValidationAutoValidation();
            builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());


            // Register response compression services
            builder.Services.AddResponseCompression(options =>
            {
                // You can configure which providers to use (Gzip, Brotli, etc.)
                options.EnableForHttps = true; // Optional: Enable compression for HTTPS requests
                options.Providers.Add<GzipCompressionProvider>();  // Add Gzip compression
                options.Providers.Add<BrotliCompressionProvider>(); // Add Brotli compression
            });
            // Configure Rate Limiting
            builder.Services.AddRateLimiter(options =>
            {
                // Define a global rate limiter
                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                {
                    // Define the rate limiter for each IP address
                    return RateLimitPartition.GetFixedWindowLimiter(
                        context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
                        key => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 20, // Max requests allowed
                            Window = TimeSpan.FromMinutes(1), // Time window
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                            QueueLimit = 5
                        });
                });

                // Define rejection status code for too many requests
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            // Enable OpenAPI and Scalar APIs in Development Mode
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            // Enforce HTTPS
            app.UseHttpsRedirection(); // Redirect all HTTP traffic to HTTPS
            app.UseHsts(); // Enforce HTTP Strict Transport Security (HSTS) in production

            // Secure Headers Middleware
            app.Use(async (context, next) =>
            {
                context.Response.Headers["X-Content-Type-Options"] = "nosniff"; // Prevent MIME-type sniffing
                context.Response.Headers["X-Frame-Options"] = "DENY"; // Prevent clickjacking attacks
                context.Response.Headers["X-XSS-Protection"] = "1; mode=block"; // Enable browser-based XSS protection
                context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin"; // Control referrer policy
                context.Response.Headers["Permissions-Policy"] =
                    "geolocation=(), microphone=(), camera=(), fullscreen=(), payment=()"; // Restrict sensitive permissions
                context.Response.Headers["Content-Security-Policy"] =
                    "default-src 'self'; script-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"; // Content Security Policy (CSP)
                await next();
            });

            // Enable Response Compression for Performance
            app.UseResponseCompression();

            // Enable Cross-Origin Resource Sharing (CORS) securely
            app.UseCors("CORSPolicy");

            // Middleware for Authentication and Authorization
            app.UseAuthentication(); // Ensure proper authentication setup
            app.UseAuthorization(); // Apply role-based or policy-based authorization

            // Static File Security
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers["Cache-Control"] = "public,max-age=31536000,immutable"; // Cache static files securely
                }
            });

            // Middleware for Exception Handling
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage(); // Enable detailed error pages in development
            }
            else
            {
                app.UseExceptionHandler("/Home/Error"); // Redirect to error page in production
                app.UseStatusCodePagesWithReExecute("/Error/{0}"); // Handle 404 and other status codes gracefully
            }

            // Prevent Exposure of Server Information
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Remove("Server"); // Hide the server header
                await next();
            });



            // Anti-CSRF Middleware (Additional Security for APIs)
            //app.Use(async (context, next) =>
            //{
            //    if (context.Request.Method == HttpMethods.Post ||
            //        context.Request.Method == HttpMethods.Put ||
            //        context.Request.Method == HttpMethods.Delete)
            //    {
            //        var csrfToken = context.Request.Headers["X-CSRF-TOKEN"];
            //        if (string.IsNullOrEmpty(csrfToken) || csrfToken != "expected_csrf_token")
            //        {
            //            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            //            await context.Response.WriteAsync("CSRF token validation failed.");
            //            return;
            //        }
            //    }
            //    await next();
            //});
            app.UseRateLimiter();

            // Routing Middleware
            app.UseRouting();

            // Map API Controllers
            app.MapControllers();
            RoleSeeder.SeedRolesAsync(app.Services).Wait();
            // Run the Application
            app.RunAsync().Wait();

        }
    }
}
