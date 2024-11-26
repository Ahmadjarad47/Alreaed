using alraed.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.Core.Service
{
    public interface IEmailService
    {
        Task SendEmailAsync(Email email);
    }
}
