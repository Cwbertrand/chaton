using Activities.DTOs;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {

        public MappingProfiles()
        {
            // We'll be moving from an Activity(the activity being edited) to an activity(The activity that is already existing the the database)
            CreateMap<Activity, Activity>();

            //Making the query to get the various attendees info
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUserName, opt => opt.MapFrom(s => s.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName));
                
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, opt => opt.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, opt => opt.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, opt => opt.MapFrom(s => s.AppUser.Biography))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
                
            //Mapping through the user's photos to get the main profile picture
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));

            // Mapping through the comments properties which have relations with the app user to get the user's information
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, opt => opt.MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.Username, opt => opt.MapFrom(s => s.User.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.User.Photos.FirstOrDefault(x => x.IsMain).Url));


        }
    }
}