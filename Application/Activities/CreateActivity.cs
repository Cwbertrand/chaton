using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class CreateActivity
    {
        public class Command : IRequest<ResultErrorOrSuccess<Unit>>
        {
            public Activity Activity { get; set; }
        }

        //Method handling validation for the form fields
        public class CommandValidation : AbstractValidator<Command>
        {
            public CommandValidation()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidation());
            }
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
                _context.Activities.Add(request.Activity);

                // SavechangesAsync returns an integer
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return ResultErrorOrSuccess<Unit>.Failure("Failed to create activity");

                // This basically returns nothing, however it's just to let our controller(api) know that we're finish
                return ResultErrorOrSuccess<Unit>.Success(Unit.Value);
            }
        }
    }
}