using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Orders
{
    public class SearchOrderParam
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string ProviderName { get; set; }
        public string ProviderCode { get; set; }
        public string ContructionName { get; set; }
        public string ContactCode { get; set; }
        public int Status { get; set; }
        public DateTime? DeadlineDate { get; set; }
        public string ModifiedBy { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string CreatedBy { get; set; }
        public int CreatedById { get; set; }
        public DateTime CreatedDate{get;set;}
        public int ProviderId { get; set; }
        public string AmountBeforeTax { get; set; }//số tiền trước thuế
        public string AmountAfterTax { get; set; }//số tiền sau thuê
        public float Rate { get; set; } //Tỉ lệ VAT
        public int? MoneyTypeID { get; set; }//loại tiền
        public string ConstructionCode { get; set; } //Mã công trình 
        public string Description { get; set; }//nội dung mua hàng
        public float? Warranty { get; set; }//Thời hạn bảo hành
        public float? outOfDate { get; set; }//Quá hạn phạt mỗi ngày
        public int IsImport { get; set; }//Nhập khẩu
        public string ProductType { get; set; }//loại sản phẩm => hạng mục lớn
        public string ContructionType { get; set; }//loại công trình => hạng mục nhỏ
        public string PaymentTerms { get; set; } //Điều kiện thanh toán

        public string EstimatedCategory { get; set; } //Hạng mục dự toán  
        public string EstimatedName { get; set; } //Tên dự toán 
        public string AmountMoney { get; set; } //Số tiền  
        public int? AmountMoneyType { get; set; } // loại tiền tệ: Số tiền 

        public List<OrderPaymentDetail> orderPaymentDetails { get; set; }
    }
    //public class OrderPaymentDetail
    //{
    //    public int? OrderPaymentId { get; set; }
    //    public string Percent { get; set; }
    //    public string PaymentDate { get; set; }
    //    public int PaymentType { get; set; }
    //    public string MoneyAccumulation { get; set; } //Lũy kế tiên
    //    public string PercentAccumulation { get; set; } //Lũy kế %
    //    public string PaymentAmount { get; set; } //Số tiền thanh toán
    //}
}
