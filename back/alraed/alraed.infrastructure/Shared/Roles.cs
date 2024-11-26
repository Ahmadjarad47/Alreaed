using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.infrastructure.Shared
{
    public static class Roles
    {
        public static string user = "User";
        public static string Admin = "Admin";
        public static string SubAdmin = "SupAdmin";
        public static readonly string[] AllRoles = { user, Admin, SubAdmin };
    }
}
