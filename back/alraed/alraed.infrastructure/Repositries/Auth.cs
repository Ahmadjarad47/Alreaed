using alraed.Core.DTOs.AuthDto;
using alraed.Core.Entities;
using alraed.Core.interfaces;
using alraed.Core.Models;
using alraed.Core.Service;
using alraed.infrastructure.Shared;
using Azure;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.infrastructure.Repositries
{
    public class Auth : IAuth
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly IGenerateToken _generateToken;
        public Auth(UserManager<AppUser> userManager, IEmailService emailService, IGenerateToken generateToken)
        {
            _userManager = userManager;
            _emailService = emailService;
            _generateToken = generateToken;
        }


        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var response = new AuthResponse();

            // Always check password validity, even if the user doesn't exist, for security.
            var user = await _userManager.FindByEmailAsync(request.Email).ConfigureAwait(false);
            var isPasswordValid = user != null && await _userManager.CheckPasswordAsync(user, request.Password).ConfigureAwait(false);

            if (user == null || !isPasswordValid)
            {
                // Consistent error message to avoid email enumeration attacks
                response.Message = "Invalid email or password.";
                response.StatusCode = 401; // Unauthorized
                return response;
            }

            if (!user.EmailConfirmed)
            {
                // If the user's email is not confirmed, send a new confirmation email
                response.Message = "Your email address is not confirmed. A new confirmation link has been sent to your email.";
                response.StatusCode = 403; // Forbidden

                // Generate new confirmation token
                string token = await _userManager.GenerateEmailConfirmationTokenAsync(user).ConfigureAwait(false);

                // Send a new confirmation email
                await SendEmailAsync(user.Email, "active", "Confirm Your Email Address" + "Please click the link below to confirm your email address.", token);

                return response;
            }

            // Successful authentication
            response.StatusCode = 200;
            response.Message = await _generateToken.CreateToken(user);
            return response;
        }


        public async Task<AuthResponse> RegisterAsync(RegisterRequest register)
        {
            AuthResponse response = new();
            List<string>? errors = new List<string>();

            // التحقق من البريد الإلكتروني واسم المستخدم بالتوازي
            AppUser? emailTask = await _userManager.FindByEmailAsync(register.Email);
            AppUser? userNameTask = await _userManager.FindByNameAsync(register.userName);

            //await Task.WhenAll(emailTask, userNameTask);

            // التحقق من البريد الإلكتروني
            if (emailTask != null)
                errors.Add("This email is already registered.");

            // التحقق من اسم المستخدم
            if (userNameTask != null)
                errors.Add("This username is already registered.");

            // إذا كانت هناك أخطاء
            if (errors.Any())
            {
                response.Message = string.Join(" | ", errors);
                response.StatusCode = 400; // أو أي رمز حالة مناسب للأخطاء
                return response;
            }


            AppUser? user = new AppUser()
            {
                Email = register.Email,
                city = register.City,
                UserName = register.userName,
                PhoneNumber = register.Phone,

            };

            IdentityResult? CreateUser = await _userManager.CreateAsync(user, register.Password);
            if (CreateUser.Succeeded)
            {
                response.Message = "Register Success, please confirm your account";
                response.StatusCode = 200;
                // Generate email confirmation token
                string emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user).ConfigureAwait(false);

                // Send confirmation email asynchronously
                var emailSubject = "Activate Your Account - Alraed Center";
                var emailBody = "Welcome to Alraed Center! To complete your registration, please confirm your email address using the link below.";

                // Call to email sending service (enhanced with a more informative email)
                await SendEmailAsync(user.Email, "active", emailSubject + emailBody, emailConfirmationToken);


            }
            else
            {
                response.Message = string.Join(" ", CreateUser.Errors.Select(e => e.Description));
                response.StatusCode = 400; // أو أي رمز حالة مناسب للأخطاء
            }

            return response;
        }

        public async Task<AuthResponse> ActiveUserAsync(ActiveRequest request)
        {
            var response = new AuthResponse();

            // Find the user by email
            var user = await _userManager.FindByEmailAsync(request.Email).ConfigureAwait(false);
            if (user == null)
            {
                // Consistent error message to prevent email enumeration attacks
                response.Message = "Invalid email or token.";
                response.StatusCode = 401; // Unauthorized
                return response;
            }

            if (user.EmailConfirmed)
            {
                // If the email is already confirmed, return success
                response.Message = "Email is already confirmed.";
                response.StatusCode = 200; // OK
                return response;
            }

            // If the email is not confirmed, try to confirm the email using the provided token
            var result = await _userManager.ConfirmEmailAsync(user, request.token).ConfigureAwait(false);
            if (result.Succeeded)
            {
                response.Message = "Email confirmed successfully.";
                response.StatusCode = 200; // OK
            }
            else
            {
                // If email confirmation fails, send a new confirmation email
                response.Message = "Invalid token or email confirmation failed.";
                response.StatusCode = 400; // Bad Request

                // Generate a new email confirmation token
                string token = await _userManager.GenerateEmailConfirmationTokenAsync(user).ConfigureAwait(false);

                // Send the new confirmation email
                await SendEmailAsync(user.Email, "active", "Confirm Your Email Address" + "Please click the link below to confirm your email address.", token);
            }

            return response;
        }

        public async Task<AuthResponse> ResetPassword(ResetPasswordRequest request)
        {
            var response = new AuthResponse();

            // Find the user by email
            var user = await _userManager.FindByEmailAsync(request.Email).ConfigureAwait(false);
            if (user == null)
            {
                // Consistent error message to avoid email enumeration attacks
                response.Message = "Invalid email or token.";
                response.StatusCode = 401; // Unauthorized
                return response;
            }

            // Attempt to reset the password
            var result = await _userManager.ResetPasswordAsync(user, request.token, request.Password).ConfigureAwait(false);
            if (result.Succeeded)
            {
                response.Message = "Password reset successfully.";
                response.StatusCode = 200; // OK
            }
            else
            {
                // Collect errors for detailed feedback
                response.Message = "Password reset failed.";
                response.StatusCode = 400; // Bad Request
                response.Message += result.Errors.Select(e => e.Description).ToList();
            }

            return response;
        }

        public async Task SendEmailAsync(string email, string component, string subject, string token)
        {
            var Email = new Email(email, subject, EmailStringBody.Send(email, token, component, message: subject));
            await _emailService.SendEmailAsync(Email);
        }
    }
}

