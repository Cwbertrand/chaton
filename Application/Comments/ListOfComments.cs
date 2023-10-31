using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class ListOfComments
    {
        public class Query : IRequest<ResultErrorOrSuccess<List<CommentDto>>>
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, ResultErrorOrSuccess<List<CommentDto>>>
        {
            private readonly ChatOnDbContext _context;
            private readonly IMapper _mapper;
            public Handler(ChatOnDbContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<ResultErrorOrSuccess<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await _context.Comments
                    .Where(x => x.Activity.Id == request.ActivityId)
                    .OrderByDescending(x => x.CreatedAt)
                    .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                return ResultErrorOrSuccess<List<CommentDto>>.Success(comments);
            }
        }
    }
}