using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using CourseCRUD_API._Repositories.Interfaces;
using CourseCRUD_API._Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CourseCRUD_API._Services.Services
{
    public class CategoryService : ICategoryService
    {
        private ICategoryRepository _categoryRepo;

        public CategoryService(ICategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        public async Task<IList<KeyValuePair<int, string>>> GetKVCategories()
        {
            var results = await _categoryRepo
                .FindAll()
                .Select(x => new KeyValuePair<int, string>(x.Category_ID, x.Category_Name))
                .ToListAsync();

            return results;
        }
    }
}