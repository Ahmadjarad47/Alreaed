using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.Core.DTOs.AuthDto
{
    public class AuthResponse
    {
        public string Message { get; set; }
        public int StatusCode { get; set; } = 404;
    }
}
