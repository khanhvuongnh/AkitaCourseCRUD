using System.ComponentModel.DataAnnotations;

namespace CourseCRUD_API.Models
{
    public partial class Category
    {
        [Key]
        public int Category_ID { get; set; }
        [StringLength(255)]
        public string Category_Name { get; set; }
    }
}
