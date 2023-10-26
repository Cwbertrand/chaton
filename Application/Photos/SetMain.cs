using Application.Core;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<ResultErrorOrSuccess<Unit>>
        {
            public string Id { get; set; }
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
                var user = await _context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
                
                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);
                if (photo == null) return null;

                var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

                if (currentMain != null) currentMain.IsMain = false;

                photo.IsMain = true;

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return ResultErrorOrSuccess<Unit>.Success(Unit.Value);

                return ResultErrorOrSuccess<Unit>.Failure("Problem setting main photo");
            }
        }
    }
}