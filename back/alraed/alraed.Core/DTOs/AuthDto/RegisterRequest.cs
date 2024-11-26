using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.Core.DTOs.AuthDto
{
    public record RegisterRequest : BaseRequest
    {
        public string userName { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
    }
}
