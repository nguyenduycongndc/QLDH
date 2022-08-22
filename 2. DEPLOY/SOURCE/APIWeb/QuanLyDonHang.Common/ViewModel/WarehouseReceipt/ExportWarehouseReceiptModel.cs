using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.WarehouseReceipt
{
    public class ExportWarehouseReceiptModel
    {
        [DisplayName("STT")]
        public int STT { get; set; }
        [DisplayName("Mã đơn hàng")]
        public string Code { get; set; }
        [DisplayName("Nhà cung cấp")]
        public string ProviderName { get; set; }
        [DisplayName("Nội dung mua hàng")]
        public string Content { get; set; }//Nội dung mua hàng
        [DisplayName("Thời gian công trình yêu cầu")]
        public DateTime? ConstructionDate { get; set; }//thời gian công trình yêu cầu
        [DisplayName("ETD(Dự kiến ở cảng)")]
        public DateTime? ETD { get; set; }//thời gian
        [DisplayName("ETD(Dự kiến đến cảng)")]
        public DateTime? ETA { get; set; }//thời gian
        [DisplayName("Cảng xuất khẩu")]
        public string PortExport { get; set; }//Cảng xuất khẩu
        [DisplayName("Số Cont")]
        public string ContNumber { get; set; }
        [DisplayName("Thực tế ETD")]
        public DateTime? RealityETD { get; set; }//thời gian
        [DisplayName("Thực tế ETA")]
        public DateTime? RealityETA { get; set; }//thời gian
        [DisplayName("Ngày thực tế đến hiện trường")]
        public DateTime? RealityDate { get; set; }//thời gian thự tế
        [DisplayName("Ghi chú")]
        public string Note { get; set; }
        [DisplayName("Ngày tạo")]
        public DateTime? CreatedDate { get; set; }
        [DisplayName("Điều kiện mua bán")]
        public string TermsOfSale { get; set; }//Điều kiện mua bán
        [DisplayName("Tài liệu xuất hàng")]
        public string ShippingDocuments { get; set; }//Tài liệu xuất hàng
        [DisplayName("Phí đại lý")]
        public string AgentMoney { get; set; }//Phí đại lý
        [DisplayName("Loại tiền Phí đại lý")]
        public int? AgentMoneyType { get; set; }//Loại tiền Phí đại lý
        [DisplayName("Phí khác")]
        public string OtherMoney { get; set; }//Phí khác
        [DisplayName("Loại tiền Phí khác")]
        public int? OtherMoneyType { get; set; }//Loại tiền Phí khác
        [DisplayName("Điều kiện thanh toán")]
        public string PaymentTerms { get; set; }//Điều kiện thanh toán (find theo mã đơn hàng chọn trên)
    }
}
