using Activities.DTOs;
using Application.Core;
using Application.Interface;
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
        public class Query : IRequest<ResultErrorOrSuccess<PagedList<ActivityDto>>> 
        {
            public  ActivityFilterParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, ResultErrorOrSuccess<PagedList<ActivityDto>>>
        {
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            // This is what is called dependency injection. Creating an activity endpoint,
            // we have to query the activity content
            private readonly ChatOnDbContext _context;
            public Handler(ChatOnDbContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }
            public async Task<ResultErrorOrSuccess<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // var activities = await _context.Activities
                //     .Include(a => a.Attendees)
                //     .ThenInclude(u => u.AppUser)
                //     .ToListAsync(cancellationToken);

                // var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);
                        //OR

                var query = _context.Activities
                    .Where(d => d.Date >= request.Params.StartDate)
                    .OrderBy(a => a.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                            new {currentUsername = _userAccessor.GetUserName()})
                    .AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(x => x.Attendees.Any(a => a.Username == _userAccessor.GetUserName()));
                }

                if (request.Params.IsHost && !request.Params.IsGoing)
                {
                    query = query.Where(x => x.HostUserName == _userAccessor.GetUserName());
                }
                //return result of type success
                return ResultErrorOrSuccess<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>.CreateAsync(query, request.Params.pageNumber,
                        request.Params.pageSize)
                );
            }
        }
    }
}