namespace CourseCRUD_API.Dtos
{
    public class CourseDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? Category_ID { get; set; }
        public decimal? Price { get; set; }

        public string Category_Name { get; set; }
    }
}