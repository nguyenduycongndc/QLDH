using PagedList;
using QuanLyDonHang.Common.HelpPages;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Orders
{
    public class PageListOrder : IPageList<SearchOrderParam>
    {
        public int TotalItem { get; set; }
        public int PageNumber { get ; set ; }
        public int TotalPage { get ; set ; }
        public IPagedList<SearchOrderParam> list { get ; set ; }
    }
}
