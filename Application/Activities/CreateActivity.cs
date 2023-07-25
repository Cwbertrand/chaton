using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class CreateActivity
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly ChatOnDbContext _context;
            public Handler(ChatOnDbContext context)
            {
                _context = context;
            }
            
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Activities.Add(request.Activity);

                await _context.SaveChangesAsync();

                // This basically returns nothing, however it's just to let our controller(api) know that we're finish
                return Unit.Value;
            }
        }
    }
}