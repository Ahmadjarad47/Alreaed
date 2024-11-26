using alraed.Core.Models;
using alraed.Core.Service;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.infrastructure.Repositries.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task SendEmailAsync(Email emailDTO)
        {


            // Create the email message
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Alraed-Center", "info@alraed.com"));
            message.To.Add(new MailboxAddress(emailDTO.To, emailDTO.To));
            message.Subject = emailDTO.Subject;
            message.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = emailDTO.Content };

            // Use SMTP client
            using var smtp = new MailKit.Net.Smtp.SmtpClient();
            try
            {
                // Validate configuration
                string? smtpServer = _configuration["EmailSetting:Smtp"];
                string? portValue = _configuration["EmailSetting:Port"];
                string? username = _configuration["EmailSetting:Username"];
                string? password = _configuration["EmailSetting:Password"];

                if (string.IsNullOrWhiteSpace(smtpServer) ||
                    string.IsNullOrWhiteSpace(portValue) ||
                    string.IsNullOrWhiteSpace(username) ||
                    string.IsNullOrWhiteSpace(password) ||
                    !int.TryParse(portValue, out var port))
                {
                    throw new InvalidOperationException("Invalid email configuration.");
                }

                // Connect to SMTP server
                await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);

                // Authenticate
                await smtp.AuthenticateAsync(username, password).ConfigureAwait(false);

                // Send the email
                await smtp.SendAsync(message).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                // Log securely and rethrow as a generic exception
                Console.WriteLine($"Email sending failed: {ex.Message}");
                throw new InvalidOperationException("An error occurred while sending the email.");
            }
            finally
            {
                if (smtp.IsConnected)
                {
                    await smtp.DisconnectAsync(true).ConfigureAwait(false);
                }
            }
        }
    }

}
