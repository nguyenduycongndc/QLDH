using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Search
{
    public class DataPageListOutputModel
    {
        public int page { get; set; }
        public int limit { get; set; }
        public double totalPage { get; set; }
        public object data { get; set; }
    }
}
