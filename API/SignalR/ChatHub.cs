using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(CreateComment.Command command)
        {
            var comment = await _mediator.Send(command);

            // Sending the comment to anybody who is connected to the hub
            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }


        // When a client joins the hub, the client should be able to join the group. So using the connectionId makes it possible to
        // to include the user to the activity in question
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"];

            //The user is added to the group of the activity id
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

            // Sending the list of comments to the client which is coming from class ListOfComments
            var result = await _mediator.Send(new ListOfComments.Query{ActivityId = Guid.Parse(activityId)});

            //And it's send to the person who is making the request which is the caller, the person making the request to connect
            // to the hub
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}