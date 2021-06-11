using System.Collections.Generic;

namespace CourseCRUD_API.Helpers.Utilities
{
    public class SearchParam
    {
        public List<SortParam> SortParams { get; set; }
        public FilterParam FilterParam { get; set; }
    }

    public class SortParam
    {
        public string SortColumn { get; set; }
        public string SortBy { get; set; }
    }

    public class FilterParam
    {
        public string Keyword { get; set; }
        public int? Category_ID { get; set; }
        public decimal? Price { get; set; }
    }
}