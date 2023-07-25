
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class ChatOnDbContext : DbContext
    {
        public ChatOnDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Activity> Activities { get; set; }
    }
}