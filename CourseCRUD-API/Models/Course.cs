using System.ComponentModel.DataAnnotations;

namespace CourseCRUD_API.Models
{
    public partial class Course
    {
        [Key]
        [StringLength(50)]
        public string Id { get; set; }
        [StringLength(50)]
        public string Name { get; set; }
        [StringLength(50)]
        public string Description { get; set; }
    }
}