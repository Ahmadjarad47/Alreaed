using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.Core.Entities
{
    public class AppUser : IdentityUser
    {
        public string city { get; set; }

    }
}
