using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace QuanLyDonHang.Domain.Models
{
    public class Order : BaseModel
    {
        public string Code { get; set; }
        public string ContructionName { get; set; }//tên công trình
        public string ContructionType { get; set; }//loại công trình => hạng mục nhỏ
        public string ProductType { get; set; }//loại sản phẩm => hạng mục lớn
        public string AmountBeforeTax { get; set; }//số tiền trước thuế
        public string AmountAfterTax { get; set; }//số tiền sau thuê
        public string ContactNumber { get; set; }
        public DateTime? DeadlineDate { get; set; }//thời hạn hoàn công
        public DateTime? WarrantyPeriod { get; set; }
        public float? outOfDate { get; set; }//Quá hạn phạt mỗi ngày
        public float? Warranty { get; set; }//Thời hạn bảo hành
        public string ContactCode { get; set; }
        public int IsImport { get; set; }
        public string Description { get; set; }//nội dung mua hàng
        public DateTime? ModifiedDate { get; set; }
        public int Status { get; set; }
        public int? ModifiedByID { get; set; }
        public int CreatedByID { get; set; }
        public int? MoneyTypeID { get; set; }
        public int ProviderID { get; set; }
        public float Rate { get; set; } //Tỉ lệ VAT
        public string PaymentTerms  { get; set; } //Điều kiện thanh toán
        public string ConstructionCode  { get; set; } //Mã công trình 

        public string EstimatedCategory   { get; set; } //Hạng mục dự toán  
        public string EstimatedName    { get; set; } //Tên dự toán 
        public string AmountMoney { get; set; } //Số tiền  
        public int? AmountMoneyType { get; set; } // loại tiền tệ: Số tiền  
        public virtual Provider Provider { get; set; }
        public virtual ICollection<OrderDocument> OrderDocuments { get; set; }
        public virtual ICollection<OrderPayment> OrderPayments { get; set; }

    }
}
