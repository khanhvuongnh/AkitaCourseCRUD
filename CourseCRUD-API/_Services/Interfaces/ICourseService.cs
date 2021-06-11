using System.Threading.Tasks;
using CourseCRUD_API.Dtos;
using CourseCRUD_API.Helpers.Utilities;
using CourseCRUD_API.Models;

namespace CourseCRUD_API._Services.Interfaces
{
    public interface ICourseService
    {
        Task<PageListUtility<CourseDto>> GetAll(SearchParam search, PaginationParam pagination);

        Task<OperationResult> Create(CourseDto courseDto);

        Task<OperationResult> Delete(string id);

        Task<OperationResult> Update(CourseDto courseDto);

        Task<MinMaxPriceDto> GetMinMaxPrice();
    }
}