using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Orders
{
    public class AddOrderViewModel
    {
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
        //public int? Payment1 { get; set; }
        //public int? PaymentDate1 { get; set; }
        //public int? Payment2 { get; set; }
        //public int? PaymentDate2 { get; set; }
        //public int? Payment3 { get; set; }
        //public int? PaymentDate3 { get; set; }
        public string AmountAfterTax { get; set; }//số tiền sau thuê
        public float Rate { get; set; } //Tỉ lệ VAT
        public string PaymentTerms { get; set; } //Điều kiện thanh toán
        public string ConstructionCode { get; set; } //Mã công trình 

        public string EstimatedCategory { get; set; } //Hạng mục dự toán  
        public string EstimatedName { get; set; } //Tên dự toán 
        public string AmountMoney { get; set; } //Số tiền  
        public int? AmountMoneyType { get; set; } // loại tiền tệ: Số tiền 
        public List<OrderPaymentCreate> orderPaymentCreates { get; set; }

        //public string MoneyAccumulation1 { get; set; } //Lũy kế tiên
        //public string PercentAccumulation1 { get; set; } //Lũy kế %
        //public string PaymentAmount1 { get; set; } //Số tiền thanh toán
        //public string MoneyAccumulation2 { get; set; } //Lũy kế tiên
        //public string PercentAccumulation2 { get; set; } //Lũy kế %
        //public string PaymentAmount2 { get; set; } //Số tiền thanh toán
        //public string MoneyAccumulation3 { get; set; } //Lũy kế tiên
        //public string PercentAccumulation3 { get; set; } //Lũy kế %
        //public string PaymentAmount3 { get; set; } //Số tiền thanh toán
        //public List<OrderPaymentCreate> orderPaymentCreate { get; set; }

        //public IEnumerable<OrderPaymentCreate> OrderPaymentCreate { get; set; }
    }
    public class OrderPaymentCreate
    {
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
