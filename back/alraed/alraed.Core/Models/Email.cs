using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.Core.Models
{
    public class Email
    {
        public Email(string to, string subject, string content)
        {
            To = to;

            Subject = subject;
            Content = content;
        }

        public string To { get; set; }
        public string From { get; set; } = "info@alraed.com";
        public string Subject { get; set; }
        public string Content { get; set; }
    }
}
