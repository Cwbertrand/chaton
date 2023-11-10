using Application.Core;
using Application.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<ResultErrorOrSuccess<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, ResultErrorOrSuccess<Unit>>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly ChatOnDbContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(ChatOnDbContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _photoAccessor = photoAccessor;
            }

            public async Task<ResultErrorOrSuccess<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Getting the user
                var user = await _context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null) return null;
                if (photo.IsMain) return ResultErrorOrSuccess<Unit>.Failure("You cannot delete your main photo");

                var result = await _photoAccessor.DeletePhoto(photo.Id);

                if (result == null) return ResultErrorOrSuccess<Unit>.Failure("Problem deleting photo from Cloudinary");

                user.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;
                
                if (success) return ResultErrorOrSuccess<Unit>.Success(Unit.Value);

                return ResultErrorOrSuccess<Unit>.Failure("Problem deleting photo from the API");
            }
        }

    }
}