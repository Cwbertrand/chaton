using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class DetailActivity
    {
        // this means it's return a resultErrorOrSuccess of type Activity. As we said, 
        // the <T> is a generic entity like a placeholder, so the activity takes that place
        public class Query : IRequest<ResultErrorOrSuccess<Activity>> 
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ResultErrorOrSuccess<Activity>>
        {

            private readonly ChatOnDbContext _context;
            public Handler(ChatOnDbContext context)
            {
                _context = context;

            }
            public async Task<ResultErrorOrSuccess<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);
                return ResultErrorOrSuccess<Activity>.Success(activity);
            }
        }
    }
}