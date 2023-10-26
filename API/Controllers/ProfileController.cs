using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfileController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetUserProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Detatils.Query{UserName = username}));
        }
    }
}