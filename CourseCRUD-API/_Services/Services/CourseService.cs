using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CourseCRUD_API._Repositories.Interfaces;
using CourseCRUD_API._Services.Interfaces;
using CourseCRUD_API.Dtos;
using CourseCRUD_API.Helpers.Utilities;
using CourseCRUD_API.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseCRUD_API._Services.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepo;
        private readonly IMapper _mapper;

        public CourseService(
            ICourseRepository courseRepo,
            IMapper mapper)
        {
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

        public async Task<PageListUtility<Course>> GetAll(PaginationParams pagination)
        {
            var courseQuery = _courseRepo.FindAll().OrderBy(x => x.Name);
            var courses = await PageListUtility<Course>.PageListAsync(courseQuery, pagination.PageNumber, pagination.PageSize);

            return courses;
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