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
        }
    }
}