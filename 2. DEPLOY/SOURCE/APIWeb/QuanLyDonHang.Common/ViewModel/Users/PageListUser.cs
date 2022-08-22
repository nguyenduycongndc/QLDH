using PagedList;
using QuanLyDonHang.Common.HelpPages;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Users
{
    public class PageListUser : IPageList<UserDetailViewModel>
    {
        public int TotalItem { get ; set ; }
        public int PageNumber { get ; set ; }
        public int TotalPage { get ; set ; }
        public IPagedList<UserDetailViewModel> list { get ; set ; }
    }
}
