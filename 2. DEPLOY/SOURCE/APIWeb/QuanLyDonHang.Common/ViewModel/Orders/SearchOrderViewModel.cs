using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Orders
{
    public class SearchOrderViewModel
    {
        public string Code { get; set; }
        public int Status { get; set; }
        public int ProviderId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }
}
