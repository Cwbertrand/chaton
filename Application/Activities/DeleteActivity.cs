using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class DeleteActivity
    {
        public class Command : IRequest<ResultErrorOrSuccess<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, ResultErrorOrSuccess<Unit>>
        {
        private readonly ChatOnDbContext _context;
            public Handler(ChatOnDbContext context)
            {
                _context = context;
            }
            public async Task<ResultErrorOrSuccess<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                if(activity == null) return null;

                _context.Remove(activity);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return ResultErrorOrSuccess<Unit>.Failure("Failed to delete the activity");

                return ResultErrorOrSuccess<Unit>.Success(Unit.Value);

            }
        }
    }
}