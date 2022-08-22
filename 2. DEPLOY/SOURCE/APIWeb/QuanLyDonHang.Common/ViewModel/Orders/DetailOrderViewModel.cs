using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Orders
{
    public class DetailOrderViewModel
    {
        public int ID { get; set; }
        public string Code { get; set; }
        
        public string ContructionName { get; set; }
        
        public string ContructionType { get; set; }
        
        public string ProductType { get; set; }
        
        public string AmountBeforeTax { get; set; }
        
        public string ContactNumber { get; set; }
        
        public string DeadlineDate { get; set; }
        
        public float? OutOfDate { get; set; }
        
        public float? WarrantyPeriod { get; set; }
        
        public string ContactCode { get; set; }
        
        public int IsImport { get; set; }
        
        public string Description { get; set; }
        
        public int Status { get; set; }
        
        public int? MoneyTypeID { get; set; }
        
        public int ProviderID { get; set; }
        public string Path { get; set; }
        public string AmountAfterTax { get; set; }//số tiền sau thuê
        public float Rate { get; set; } //Tỉ lệ VAT
        public string PaymentTerms { get; set; } //Điều kiện thanh toán
        public string ConstructionCode { get; set; } //Mã công trình
        public int? WarehouseReceiptID { get; set; } //Có phiếu nhập hay không

        public string EstimatedCategory { get; set; } //Hạng mục dự toán  
        public string EstimatedName { get; set; } //Tên dự toán 
        public string AmountMoney { get; set; } //Số tiền  
        public int? AmountMoneyType { get; set; } // loại tiền tệ: Số tiền 

        public List<OrderPaymentDetail> orderPaymentDetails { get; set; }
    }
    public class OrderPaymentDetail
    {
        public int? OrderPaymentId { get; set; }
        public string Percent { get; set; }
        public string PaymentDate { get; set; }
        public int PaymentType { get; set; }
        public string MoneyAccumulation { get; set; } //Lũy kế tiên
        public string PercentAccumulation { get; set; } //Lũy kế %
        public string PaymentAmount { get; set; } //Số tiền thanh toán

        public string ReceiveCode { get; set; } //Mã số nhận hàng
        public string ReceiveDate { get; set; } //Ngày nhận hàng
        public string NumberOfTests { get; set; } //Số lượng nghiệm thu 
        public string AmountOfAcceptance { get; set; } //Số tiền nghiệm thu gồm thuế VAT  
        public int? AmountOfAcceptanceType { get; set; } //Loại tiền nghiệm thu gồm thuế VAT

    }
}
