using alraed.API.Extensions;
using alraed.Core.DTOs.AuthDto;
using alraed.Core.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace alraed.API.Controllers.User
{

    public class AccountController : BaseController
    {
        public AccountController(IAuth auth) : base(auth)
        {
        }



        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-user-name")]
        [Authorize]
        public string get()
        {
            return User.GetUsername();
        }

        [Authorize]
        /// <summary>
        /// Logs out the user by clearing the authentication token.
        /// </summary>
        /// <returns>Returns a success response after removing the token cookie.</returns>
        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            // Remove the token cookie by setting it with an expired date
            Response.Cookies.Append("token", string.Empty, new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(-1), // Expire immediately
                HttpOnly = true,
                Path = "/",
                Secure = true,
                SameSite = SameSiteMode.None,
            });

            return Ok(new
            {
                Message = "You have been successfully logged out.",
                LogoutTime = DateTime.Now
            });
        }



        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("Register")]
        public async Task<ActionResult> register([FromBody] RegisterRequest request)
        {

            if (ModelState.IsValid)
            {
                var result = await auth.RegisterAsync(request);
                return result.StatusCode != 200 ? BadRequest(result) : Ok(result);
            }
            return BadRequest(ModelState);
        }





        /// <summary>
        /// Authenticates the user and issues a secure token for further requests.
        /// </summary>
        /// <param name="request">Login credentials including email/username and password.</param>
        /// <returns>Returns a success response with a token or a detailed error message.</returns>
        [HttpPost("Login")]
        public async Task<ActionResult> login([FromBody] LoginRequest request)
        {
            if (ModelState.IsValid)
            {
                var result = await auth.LoginAsync(request);

                if (result.StatusCode != 200)
                {
                    result.StatusCode = 401;
                    return Unauthorized(result);
                }
                else
                {
                    Response.Cookies.Append("token", result.Message, new CookieOptions
                    {
                        Domain = "localhost",
                        Expires = DateTime.Now.AddDays(1),
                        HttpOnly = true,
                        Path = "/",
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        IsEssential = true,

                    });
                    return Ok(result);
                }

            }
            return BadRequest(ModelState);
        }



        /// <summary>
        /// 
        /// </summary>
        /// <param name="activeRequest"></param>
        /// <returns></returns>
        [HttpPost("active")]
        public async Task<ActionResult> active(ActiveRequest activeRequest)
        {
            if (ModelState.IsValid)
            {
                var result = await auth.ActiveUserAsync(activeRequest);
                return result.StatusCode == 200 ? Ok(result) : BadRequest(result);

            }
            return BadRequest(ModelState);
        }



        /// <summary>
        /// 
        /// </summary>
        /// <param name="resetPasswordRequest"></param>
        /// <returns></returns>
        [HttpPost("reset-password")]
        public async Task<ActionResult> reset(ResetPasswordRequest resetPasswordRequest)
        {
            if (ModelState.IsValid)
            {
                var result = await auth.ResetPassword(resetPasswordRequest);
                return result.StatusCode == 200 ? Ok(result) : BadRequest(result);
            }
            return BadRequest(ModelState);
        }



    }
}
