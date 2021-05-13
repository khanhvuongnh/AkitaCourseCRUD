using CourseCRUD_API._Repositories.Interfaces;
using CourseCRUD_API.Data;
using CourseCRUD_API.Models;

namespace CourseCRUD_API._Repositories.Repository
{
    public class CourseRepository : Repository<Course>, ICourseRepository
    {
        public CourseRepository(DBContext context) : base(context)
        {
        }
    }
}