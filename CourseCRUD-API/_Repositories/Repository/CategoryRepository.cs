using CourseCRUD_API._Repositories.Interfaces;
using CourseCRUD_API.Data;
using CourseCRUD_API.Models;

namespace CourseCRUD_API._Repositories.Repository
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(DBContext context) : base(context)
        {
        }
    }
}