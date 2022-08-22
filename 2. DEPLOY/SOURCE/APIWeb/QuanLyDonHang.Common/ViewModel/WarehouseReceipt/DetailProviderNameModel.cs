using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.WarehouseReceipt
{
    public class DetailProviderNameModel
    {
        public int OrderId { get; set; }
        public string OrderCode { get; set; }
        public int ProviderId { get; set; }
        public string ProviderName { get; set; }
        public string Description { get; set; }
        public string DeadlineDate { get; set; }
        //public string Content { get; set; }//Nội dung mua hàng
        //public string ConstructionDate { get; set; }//thời gian công trình yêu cầu
        //public string ETD { get; set; }//thời gian
        //public string ETA { get; set; }//thời gian
        //public string PortExport { get; set; }//Cảng xuất khẩu
        //public int ContNumber { get; set; }
        //public string RealityETD { get; set; }//thời gian
        //public string RealityETA { get; set; }//thời gian
        //public string RealityDate { get; set; }//thời gian thự tế
        //public string Note { get; set; }
    }
}
