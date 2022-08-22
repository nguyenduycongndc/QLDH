using PagedList;
using QuanLyDonHang.Common.HelpPages;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.WarehouseReceipt
{
    public class PageList : IPageList<SearchWarehouseReceiptModel>
    {
        public int TotalItem { get; set; }
        public int PageNumber { get; set; }
        public int TotalPage { get; set; }
        public IPagedList<SearchWarehouseReceiptModel> list { get; set; }
    }
}
