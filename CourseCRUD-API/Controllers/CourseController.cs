using System.Linq;
using System.Threading.Tasks;
using CourseCRUD_API.Data;
using CourseCRUD_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet("GetAllCourses")]
        public async Task<IActionResult> GetAllCourses()
        {
            return Ok(await db.Course.ToListAsync());
        }

        [HttpGet("GetCourse/{id}")]
        public async Task<IActionResult> GetCourse(string id)
        {
            return Ok(await db.Course.Where(x => x.Id == id).FirstOrDefaultAsync());
        }

        [HttpPost("CreateCourse")]
        public async Task<IActionResult> CreateCourse([FromBody] Course course)
        {
            db.Course.Add(course);
            await db.SaveChangesAsync();
            return Ok(course);
        }

        [HttpGet("DeleteCourse/{id}")]
        public async Task<IActionResult> DeleteCourse(string id)
        {
            var course = await db.Course.Where(x => x.Id == id).FirstOrDefaultAsync();
            db.Course.Remove(course);
            return Ok(await db.SaveChangesAsync() > 0);
        }

        [HttpPost("UpdateCourse")]
        public async Task<IActionResult> UpdateCourse([FromBody] Course course)
        {
            db.Course.Update(course);
            return Ok(await db.SaveChangesAsync() > 0);
        }
    }
}