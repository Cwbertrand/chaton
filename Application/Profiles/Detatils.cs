using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Detatils
    {
        // Any method that doesn't update the database is a query
        public class Query : IRequest<ResultErrorOrSuccess<Profile>>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, ResultErrorOrSuccess<Profile>>
        {
            private readonly IMapper _mapper;
            private readonly ChatOnDbContext _context;
            public Handler(ChatOnDbContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<ResultErrorOrSuccess<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .ProjectTo<Profile>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync(x => x.Username == request.UserName);

                return ResultErrorOrSuccess<Profile>.Success(user);
            }
        }
    }
}