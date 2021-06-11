using System.Threading.Tasks;
using CourseCRUD_API._Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CourseCRUD_API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryServ;

        public CategoryController(ICategoryService categoryServ)
        {
            _categoryServ = categoryServ;
        }

        [HttpGet("All")]
        public async Task<IActionResult> GetAll()
        {
            var results = await _categoryServ.GetKVCategories();
            return Ok(results);
        }
    }
}