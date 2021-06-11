using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CourseCRUD_API.Helpers.Utilities;
using CourseCRUD_API._Services.Interfaces;
using CourseCRUD_API.Dtos;
using Microsoft.AspNetCore.SignalR;
using CourseCRUD_API.Hubs;

namespace CourseCRUD_API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseServ;
        private readonly IHubContext<CourseHub> _hubContext;

        public CourseController(ICourseService courseServ, IHubContext<CourseHub> hubContext)
        {
            _hubContext = hubContext;
            _courseServ = courseServ;
        }

        [HttpPost("GetAll")]
        public async Task<IActionResult> GetAll(SearchParam search, [FromQuery] PaginationParam pagination)
        {
            var courses = await _courseServ.GetAll(search, pagination);
            return Ok(courses);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CourseDto courseDto)
        {
            var result = await _courseServ.Create(courseDto);

            if (result.Success)
                await _hubContext.Clients.All.SendAsync("COURSE_RELOAD", true);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _courseServ.Delete(id);

            if (result.Success)
                await _hubContext.Clients.All.SendAsync("COURSE_RELOAD", true);

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] CourseDto courseDto)
        {
            var result = await _courseServ.Update(courseDto);

            if (result.Success)
                await _hubContext.Clients.All.SendAsync("COURSE_RELOAD", true);

            return Ok(result);
        }

        [HttpGet("MinMaxPrice")]
        public async Task<IActionResult> GetMinMaxPrice()
        {
            var result = await _courseServ.GetMinMaxPrice();

            return Ok(result);
        }
    }
}