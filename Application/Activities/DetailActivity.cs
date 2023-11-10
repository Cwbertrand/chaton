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
    public class DetailActivity
    {
        // this means it's return a resultErrorOrSuccess of type Activity. As we said, 
        // the <T> is a generic entity like a placeholder, so the activity takes that place
        public class Query : IRequest<ResultErrorOrSuccess<ActivityDto>> 
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ResultErrorOrSuccess<ActivityDto>>
        {
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            private readonly ChatOnDbContext _context;
            public Handler(ChatOnDbContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;

            }
            public async Task<ResultErrorOrSuccess<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                            new {currentUsername = _userAccessor.GetUserName()})
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                return ResultErrorOrSuccess<ActivityDto>.Success(activity);
            }
        }
    }
}