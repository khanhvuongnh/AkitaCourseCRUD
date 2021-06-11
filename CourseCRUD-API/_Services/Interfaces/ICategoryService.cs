using System.Collections.Generic;
using System.Threading.Tasks;

namespace CourseCRUD_API._Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IList<KeyValuePair<int, string>>> GetKVCategories();
    }
}