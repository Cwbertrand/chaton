using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Biography { get; set; }
        public ICollection<ActivityAttendee> Activities { get; set; }
        public ICollection<Photo> Photos { get; set; }

        // the user following another users
        public ICollection<UserFollowing> Followings { get; set; }

        // The followers of the user
        public ICollection<UserFollowing> Followers { get; set; }
    }
}