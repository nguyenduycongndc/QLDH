using PagedList;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.HelpPages
{
    public interface IPageList<T> where T : class
    {
        public int TotalItem { get; set; }
        public int PageNumber { get; set; }
        public int TotalPage { get; set; }
        public IPagedList<T> list { get; set; }
    }
}
