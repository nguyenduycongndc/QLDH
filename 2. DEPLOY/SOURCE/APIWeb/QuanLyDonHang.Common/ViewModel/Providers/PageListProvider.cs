using PagedList;
using QuanLyDonHang.Common.HelpPages;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Providers
{
    public class PageListProvider : IPageList<SearchProviderViewModel>
    {
        public int TotalItem { get ; set ; }
        public int PageNumber { get ; set ; }
        public int TotalPage { get ; set ; }
        public IPagedList<SearchProviderViewModel> list { get ; set ; }
    }
}
