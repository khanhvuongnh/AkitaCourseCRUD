using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CourseCRUD_API._Repositories.Interfaces;
using CourseCRUD_API._Services.Interfaces;
using CourseCRUD_API.Dtos;
using CourseCRUD_API.Helpers.Utilities;
using CourseCRUD_API.Models;
using LinqKit;
using Microsoft.EntityFrameworkCore;

namespace CourseCRUD_API._Services.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepo;
        private readonly IMapper _mapper;
        private readonly ICategoryRepository _categoryRepo;

        public CourseService(
            ICourseRepository courseRepo,
            ICategoryRepository categoryRepo,
            IMapper mapper)
        {
            _categoryRepo = categoryRepo;
            _courseRepo = courseRepo;
            _mapper = mapper;
        }

        public async Task<OperationResult> Create(CourseDto courseDto)
        {
            if (await _courseRepo.FindAll(x => x.Id == courseDto.Id).AnyAsync())
                return new OperationResult { Success = false, Caption = "Course already exists." };

            var course = _mapper.Map<Course>(courseDto);
            try
            {
                _courseRepo.Add(course);
                await _courseRepo.Save();

                return new OperationResult { Success = true, Caption = "Course was successfully created." };
            }
            catch (System.Exception ex)
            {
                return new OperationResult { Success = false, Caption = "Creating course failed on save.", Message = ex.ToString() };
            }
        }

        public async Task<OperationResult> Delete(string id)
        {
            var course = await _courseRepo.FindSingle(x => x.Id == id);

            if (course == null)
                return new OperationResult { Success = false, Caption = "Course not found." };

            try
            {
                _courseRepo.Remove(course);
                await _courseRepo.Save();

                return new OperationResult { Success = true, Caption = "Course was successfully deleted." };
            }
            catch (System.Exception ex)
            {
                return new OperationResult { Success = false, Caption = "Deleting course failed on save.", Message = ex.ToString() };
            }
        }

        public async Task<PageListUtility<CourseDto>> GetAll(SearchParam search, PaginationParam pagination)
        {
            var pred = PredicateBuilder.New<Course>(true);

            if (!string.IsNullOrEmpty(search.FilterParam.Keyword))
            {
                var keyword = search.FilterParam.Keyword.Trim().ToLower();
                pred = pred.And(x =>
                    x.Name.ToLower().Contains(keyword) ||
                    x.Description.ToLower().Contains(keyword));
            }

            if (search.FilterParam.Category_ID != null && search.FilterParam.Category_ID > 0)
            {
                var category_ID = search.FilterParam.Category_ID;
                pred = pred.And(x => x.Category_ID == category_ID);
            }

            if (search.FilterParam.Price != null)
            {
                var price = search.FilterParam.Price.Value;
                pred = pred.And(x => x.Price <= price);
            }

            var courseQuery = _courseRepo
                .FindAll(pred)
                .Join(_categoryRepo.FindAll(), x => x.Category_ID, y => y.Category_ID, (x, y) => new CourseDto
                {
                    Category_ID = x.Category_ID,
                    Category_Name = y.Category_Name,
                    Description = x.Description,
                    Id = x.Id,
                    Name = x.Name,
                    Price = x.Price
                });


            switch (search.SortParam.SortColumn)
            {
                case nameof(Course.Name):
                    courseQuery = search.SortParam.SortBy == SortBy.Asc ? courseQuery.OrderBy(x => x.Name) : courseQuery.OrderByDescending(x => x.Name);
                    break;

                case nameof(Course.Description):
                    courseQuery = search.SortParam.SortBy == SortBy.Asc ? courseQuery.OrderBy(x => x.Description) : courseQuery.OrderByDescending(x => x.Description);
                    break;

                case nameof(Course.Price):
                    courseQuery = search.SortParam.SortBy == SortBy.Asc ? courseQuery.OrderBy(x => x.Price) : courseQuery.OrderByDescending(x => x.Price);
                    break;

                default:
                    courseQuery = courseQuery.OrderBy(x => x.Name);
                    break;
            }


            var courses = await PageListUtility<CourseDto>.PageListAsync(courseQuery, pagination.PageNumber, pagination.PageSize);

            return courses;
        }

        public async Task<MinMaxPriceDto> GetMinMaxPrice()
        {
            var result = new MinMaxPriceDto
            {
                MaxPrice = await _courseRepo.FindAll().MaxAsync(x => x.Price),
                MinPrice = await _courseRepo.FindAll().MinAsync(x => x.Price)
            };

            return result;
        }

        public async Task<OperationResult> Update(CourseDto courseDto)
        {
            if (!await _courseRepo.FindAll(x => x.Id == courseDto.Id).AnyAsync())
                return new OperationResult { Success = false, Caption = "Course not found." };

            var course = _mapper.Map<Course>(courseDto);
            try
            {
                _courseRepo.Update(course);
                await _courseRepo.Save();

                return new OperationResult { Success = true, Caption = "Course was successfully updated." };
            }
            catch (System.Exception ex)
            {
                return new OperationResult { Success = false, Caption = "Updating course failed on save.", Message = ex.ToString() };
            }
        }
    }
}