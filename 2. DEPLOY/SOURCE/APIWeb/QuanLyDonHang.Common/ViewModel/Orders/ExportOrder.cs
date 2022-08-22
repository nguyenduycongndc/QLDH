using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Orders
{
    public class ExportOrder
    {
        [DisplayName("STT 順序")]
        public int STT { get; set; }
        [DisplayName("Mã đơn hàng 訂單編號")]
        public string Code { get; set; }
        [DisplayName("Ngày lập đơn hàng 訂單創建日期")]
        public string CreatedDate { get; set; }
        [DisplayName("Nhà cung cấp 供應商")]
        public string ProviderName { get; set; }
        //[DisplayName("Mã công trình 工程編號")]
        //public string ContructionCode { get; set; }
        [DisplayName("Tên công trình 工程名稱")]
        public string ContructionName { get; set; }
        [DisplayName("Nội dung mua hàng 購買內容")]
        public string Content { get; set; }
        [DisplayName("Mã hợp đồng 合約編號")]
        public string ContactCode { get; set; }
        [DisplayName("Thời hạn hoàn công 合約完成期限")]
        public string DeadlineDate { get; set; }
        //[DisplayName("Người cập nhật")]
        //public string ModifiedBy { get; set; }
        //[DisplayName("Ngày cập nhật")]
        //public string ModifiedDate { get; set; }
        //[DisplayName("Người tạo")]
        //public string CreatedBy { get; set; }
        
    }
}
