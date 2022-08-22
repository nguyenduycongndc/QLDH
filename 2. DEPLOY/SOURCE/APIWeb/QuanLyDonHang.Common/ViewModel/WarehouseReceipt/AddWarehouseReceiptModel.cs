using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.WarehouseReceipt
{
    public class AddWarehouseReceiptModel
    {
        public int OrderId { get; set; }
        public string OrderCode { get; set; }
        public int ProviderId { get; set; }
        public string ProviderName { get; set; }
        public string Content { get; set; }//Nội dung mua hàng
        public string ConstructionDate { get; set; }//thời gian công trình yêu cầu
        public string ETD { get; set; }//thời gian
        public string ETA { get; set; }//thời gian
        public string PortExport { get; set; }//Cảng xuất khẩu
        public string ContNumber { get; set; }
        public string RealityETD { get; set; }//thời gian
        public string RealityETA { get; set; }//thời gian
        public string RealityDate { get; set; }//thời gian thự tế
        public string Note { get; set; }
        public int? DeliveryProgress { get; set; }//Tiến độ xuất hàng
        public string OrderMoney { get; set; }//Số tiền đơn hàng ban đầu
        public int? OrderMoneyType { get; set; }//Loại Số tiền đơn hàng ban đầu

        public string TermsOfSale { get; set; }//Điều kiện mua bán
        public string ShippingDocuments { get; set; }//Tài liệu xuất hàng
        public string AgentMoney { get; set; }//Phí đại lý
        public int? AgentMoneyType { get; set; }// loại tiền Phí đại lý
        public string OtherMoney { get; set; }//Phí khác
        public int? OtherMoneyType { get; set; }// loại tiền Phí khác
        public string PaymentTerms { get; set; }//Điều kiện thanh toán (find theo mã đơn hàng chọn trên)
    }
}
