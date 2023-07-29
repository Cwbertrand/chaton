using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        //This allows use to use the mediator function all over the controllers that we will create
        private IMediator _mediator;

        // This code declares a protected property named "Mediator" that returns an instance of IMediator.
        // If the private field "_mediator" is null, it initializes it by resolving an instance of Mediator from the HttpContext.RequestServices.
        protected IMediator Mediator => _mediator ??=
            HttpContext.RequestServices.GetService<IMediator>();

        // This handles all the errors for wrong ids, return the response in an object
        protected ActionResult HandleResult<T>(ResultErrorOrSuccess<T> result){
            
            if (result.IsSuccess && result.Value != null)
                return Ok(result.Value);

            if (result == null) return NotFound();
            
            if(result.IsSuccess && result.Value == null)
                return NotFound();
            
            return BadRequest(result.Error);
        }
    }
}