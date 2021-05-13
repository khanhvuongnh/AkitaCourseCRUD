using AutoMapper;
using CourseCRUD_API.Dtos;
using CourseCRUD_API.Models;

namespace CourseCRUD_API.Helpers.AutoMapper
{
    public class DtoToEfMappingProfile : Profile
    {
        public DtoToEfMappingProfile()
        {
            CreateMap<CourseDto, Course>();
        }
    }
}