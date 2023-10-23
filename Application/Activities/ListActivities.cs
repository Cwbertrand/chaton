using Activities.DTOs;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class ListActivities
    {
        public class Query : IRequest<ResultErrorOrSuccess<List<ActivityDto>>> {}

        public class Handler : IRequestHandler<Query, ResultErrorOrSuccess<List<ActivityDto>>>
        {
            private readonly IMapper _mapper;

            // This is what is called dependency injection. Creating an activity endpoint,
            // we have to query the activity content
            private readonly ChatOnDbContext _context;
            public Handler(ChatOnDbContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<ResultErrorOrSuccess<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // var activities = await _context.Activities
                //     .Include(a => a.Attendees)
                //     .ThenInclude(u => u.AppUser)
                //     .ToListAsync(cancellationToken);

                // var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);
                        //OR

                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);
                //return result of type success
                return ResultErrorOrSuccess<List<ActivityDto>>.Success(activities);
            }
        }
    }
}