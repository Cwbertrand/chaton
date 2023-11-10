
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class ChatOnDbContext : IdentityDbContext<AppUser>
    {
        public ChatOnDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivitiesAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }

        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Customizing the activityattendee table giving that it's a one-to-many table between activities
            // and user
            builder.Entity<ActivityAttendee>(x => 
                x.HasKey(aa => new {aa.AppUserId, aa.ActivityId}));

            // making the appUserId a primary key
            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.Activities)
                .HasForeignKey(aa => aa.AppUserId);

            // making the ActivityId a primary key
            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId);

            // When deleting an activity, the comments should also be deleted
            builder.Entity<Comment>()
                .HasOne(a => a.Activity)
                .WithMany(c => c.Comments);
                //.OnDelete(DeleteBehavior.Cascade);

            // Configuring the UserFollowing DbSet table
            builder.Entity<UserFollowing>(b =>
            {
                // Giving ObserverId and TargetId a primary key
                b.HasKey(k => new {k.ObserverId, k.TargetId});

                // Giving the ObserverId and TargetId a foreign Key also
                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(o => o.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(o => o.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
                
        }
    }
}