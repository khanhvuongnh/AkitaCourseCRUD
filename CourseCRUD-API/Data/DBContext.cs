using Microsoft.EntityFrameworkCore;
using CourseCRUD_API.Models;

namespace CourseCRUD_API.Data
{
    public partial class DBContext : DbContext
    {
        public virtual DbSet<Course> Course { get; set; }

        public DBContext(DbContextOptions<DBContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder); 
    }
}