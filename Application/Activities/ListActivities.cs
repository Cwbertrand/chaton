using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class ListActivities
    {
        public class Query : IRequest<ResultErrorOrSuccess<List<Activity>>> {}

        public class Handler : IRequestHandler<Query, ResultErrorOrSuccess<List<Activity>>>
        {

            // This is what is called dependency injection. Creating an activity endpoint,
            // we have to query the activity content
            private readonly ChatOnDbContext _context;
            public Handler(ChatOnDbContext context)
            {
                _context = context;
            }
            public async Task<ResultErrorOrSuccess<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                //return result of type success
                return ResultErrorOrSuccess<List<Activity>>.Success(await _context.Activities.ToListAsync());
            }
        }
    }
}