using Application.Core;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<ResultErrorOrSuccess<Unit>>
        {
            public string TargetUsername { get; set; }
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
                // getting the user
                var observer = await _context.Users.FirstOrDefaultAsync(x => 
                    x.UserName == _userAccessor.GetUserName()
                );

                var target = await _context.Users.FirstOrDefaultAsync( x =>
                x.UserName == request.TargetUsername);

                if (target == null) return null;

                var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                // Adding Or Removing the user's followers
                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };
                    _context.UserFollowings.Add(following);

                } else {
                    _context.UserFollowings.Remove(following);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return ResultErrorOrSuccess<Unit>.Success(Unit.Value);

                return ResultErrorOrSuccess<Unit>.Failure("Failed to update a following");
            }
        }
    }
}