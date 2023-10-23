using Application.Core;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<ResultErrorOrSuccess<Unit>>
        {
            // Getting the Activity Id
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, ResultErrorOrSuccess<Unit>>
        {
            private readonly ChatOnDbContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(ChatOnDbContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;

            }

            public async Task<ResultErrorOrSuccess<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //Getting the activity
                var activity = await _context.Activities
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);
                
                if (activity == null) return null;

                // Getting the user
                var user = await _context.Users.FirstOrDefaultAsync(u =>
                    u.UserName == _userAccessor.GetUserName());
                
                if (user == null) return null;

                var hostUserName = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                // Cancelling the activity when the use is the host
                if(attendance != null && hostUserName == user.UserName)
                    activity.IsCancelled = !activity.IsCancelled;
                
                // Removing attendance when the user is just an attendee
                if(attendance != null && hostUserName != user.UserName)
                    activity.Attendees.Remove(attendance);

                // Adding attendance to the activity as an attendee
                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false,
                    };

                    activity.Attendees.Add(attendance);
                }

                // Saving it to the database
                var result = await _context.SaveChangesAsync() > 0;

                return result ? ResultErrorOrSuccess<Unit>.Success(Unit.Value) : ResultErrorOrSuccess<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}