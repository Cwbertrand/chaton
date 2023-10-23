using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // [AllowAnonymous]
    public class ActivitiesController : BaseApiController
    {

        [HttpGet] //api/activities
        public async Task<IActionResult> GetActivities()
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query()));
        }

        //[Authorize] means the user must be authenticated(signed in) before accessing this endpoint
        [HttpGet("{id}")] //api/activities/{id}
        public async Task<IActionResult> GetActivity(Guid id)
        {
            //Testing the results that it returns to see what kind of http response it is
            return HandleResult(await Mediator.Send(new DetailActivity.Query{Id = id}));
            
            


            //this is a possible way to do an error handling for when a user
            //enters an id activity that doesn't exist

            // var activity = await Mediator.Send(new DetailActivity.Query{Id = id});
            // if (activity == null) return NotFound();
            // return activity;

        }

        [HttpPost]
        // We're not returning the activity object, so we use an interface
        // This IActionResult gives us http response types to know the various errors
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new CreateActivity.Command  {Activity = activity }));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new EditActivity.Command{Activity = activity}));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new DeleteActivity.Command{Id = id}));
        }

        // Cancelling activity when host, deleting attendance and adding when attendee
        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }

    }
}