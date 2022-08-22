using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace QuanLyDonHang.Domain.Models
{
    public class WarehouseReceipt : BaseModel
    {
        public int OrderId { get; set; }
        public string OrderCode { get; set; }
        public int ProviderId { get; set; }
        public string ProviderName { get; set; }
        public string Content { get; set; }//Nội dung mua hàng
        public DateTime? ConstructionDate { get; set; }//thời gian công trình yêu cầu
        public DateTime? ETD { get; set; }
        public DateTime? ETA { get; set; }
        public string PortExport { get; set; }//Cảng xuất khẩu
        public string ContNumber { get; set; }
        public DateTime? RealityETD { get; set; }
        public DateTime? RealityETA { get; set; }
        public DateTime? RealityDate { get; set; }//thời gian thự tế
        public string Note { get; set; }
        public int? DeliveryProgress { get; set; }//Tiến độ xuất hàng
        public string OrderMoney { get; set; }//Số tiền đơn hàng ban đầu
        public int? OrderMoneyType { get; set; }//Loại Số tiền đơn hàng ban đầu

        public string TermsOfSale { get; set; }//Điều kiện mua bán
        public string ShippingDocuments  { get; set; }//Tài liệu xuất hàng
        public string AgentMoney   { get; set; }//Phí đại lý
        public int? AgentMoneyType   { get; set; }// loại tiền Phí đại lý
        public string OtherMoney    { get; set; }//Phí khác
        public int? OtherMoneyType { get; set; }// loại tiền Phí khác
        public string PaymentTerms  { get; set; }//Điều kiện thanh toán (find theo mã đơn hàng chọn trên) 


        public virtual Order Order { get; set; }
        //public virtual Provider Provider { get; set; }
        //public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Provider> Providers { get; set; }
    }
}
