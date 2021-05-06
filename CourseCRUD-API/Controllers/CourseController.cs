using System.Linq;
using System.Threading.Tasks;
using CourseCRUD_API.Data;
using CourseCRUD_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseCRUD_API.Helpers.Utilities;

namespace CourseCRUD_API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CourseController : ControllerBase
    {
        private readonly DBContext db;

        public CourseController(DBContext db)
        {
            this.db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PaginationParams pagination)
        {
            var courses = await PageListUtility<Course>.PageListAsync(db.Course.OrderBy(x => x.Name), pagination.PageNumber, pagination.PageSize);
            return Ok(courses);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Course course)
        {
            var item = await db.Course.AnyAsync(x => x.Id == course.Id);
            if (item)
                return Ok(false);

            db.Course.Add(course);
            var result = await db.SaveChangesAsync() > 0;
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var course = await db.Course.Where(x => x.Id == id).FirstOrDefaultAsync();
            if (course == null)
                return Ok(false);

            db.Course.Remove(course);
            var result = await db.SaveChangesAsync() > 0;
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Course course)
        {
            if (id != course.Id)
                return Ok(false);

            db.Course.Update(course);
            var result = await db.SaveChangesAsync() > 0;
            return Ok(result);
        }
    }
}