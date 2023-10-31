using Application.Core;
using Application.Interface;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class CreateComment
    {
        public  class Command : IRequest<ResultErrorOrSuccess<CommentDto>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, ResultErrorOrSuccess<CommentDto>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly ChatOnDbContext _context;
            public Handler(ChatOnDbContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<ResultErrorOrSuccess<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Getting activity
                var activity = await _context.Activities.FindAsync(request.ActivityId);
                if (activity == null) return null;

                // Getting user
                var user = await _context.Users
                    .Include(p => p.Photos)
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                var comment = new Comment {
                    User = user,
                    Activity = activity,
                    Body = request.Body
                };

                activity.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;
                if(success) return ResultErrorOrSuccess<CommentDto>.Success(_mapper.Map<CommentDto>(comment));

                return ResultErrorOrSuccess<CommentDto>.Failure("Failed to add comment");
            }
        }
    }
}