using Application.Core;
using Application.Interface;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowersList
    {
        public class Query : IRequest<ResultErrorOrSuccess<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, ResultErrorOrSuccess<List<Profiles.Profile>>>
        {
            private readonly ChatOnDbContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(ChatOnDbContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<ResultErrorOrSuccess<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    //In the case where the request is followers
                    case "followers":
                    profiles = await _context.UserFollowings.Where(x => x.Target.UserName == request.Username)
                        .Select(u => u.Observer)
                        .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                            new {currentUsername = _userAccessor.GetUserName()})
                        .ToListAsync();
                    break;

                    case "following":
                    profiles = await _context.UserFollowings.Where(x => x.Observer.UserName == request.Username)
                        .Select(u => u.Target)
                        .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                            new {currentUsername = _userAccessor.GetUserName()})
                        .ToListAsync();
                    break;
                }

                return ResultErrorOrSuccess<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}