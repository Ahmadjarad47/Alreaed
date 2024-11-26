using alraed.Core.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace alraed.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected readonly IAuth auth;

        public BaseController(IAuth auth)
        {
            this.auth = auth;
        }
    }
}
