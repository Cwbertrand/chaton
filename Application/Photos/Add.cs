using Application.Core;
using Application.Interface;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<ResultErrorOrSuccess<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, ResultErrorOrSuccess<Photo>>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            private readonly ChatOnDbContext _context;
            public Handler(ChatOnDbContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
            }

            // Getting the photo from the user upload and saving it inside the database
            public async Task<ResultErrorOrSuccess<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                var PhotoUploadResult = await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = PhotoUploadResult.Url,
                    Id = PhotoUploadResult.PublicId
                };

                if (!user.Photos.Any(u => u.IsMain)) photo.IsMain = true;

                user.Photos.Add(photo);

                var result = await _context.SaveChangesAsync() > 0;

                if (result) return ResultErrorOrSuccess<Photo>.Success(photo);

                return ResultErrorOrSuccess<Photo>.Failure("Problem adding photo");
            }
        }
    }
}