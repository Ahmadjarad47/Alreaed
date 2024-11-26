using alraed.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace alraed.Core.Service
{
    public interface IGenerateToken
    {
        Task<string> CreateToken(AppUser user);
    }
}
