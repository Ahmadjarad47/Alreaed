﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.Core.DTOs.AuthDto
{
    public record ActiveRequest
    {
        public string Email { get; set; }
        public string token { get; set; }
    }
}
