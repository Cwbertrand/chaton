using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class EditActivity
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
            private readonly IMapper _mapper;
            public Handler(ChatOnDbContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<ResultErrorOrSuccess<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id);
                
                if(activity == null) return null;
                
                _mapper.Map(request.Activity, activity);

                var result = await _context.SaveChangesAsync() > 0;
                if(!result) return ResultErrorOrSuccess<Unit>.Failure("Failed to update activity");


                return ResultErrorOrSuccess<Unit>.Success(Unit.Value);
            }
        }
    }
}