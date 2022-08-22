using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Domain.Models
{
    public class OrderPayment : BaseModel
    {
        public string Percent { get; set; }//%
        public string PaymentDate { get; set; }//ngày thanh toán
        public int PaymentType { get; set; }//khoản thanh toán+
        public int OrderId { get; set; }
        public string MoneyAccumulation { get; set; } //Lũy kế tiên
        public string PercentAccumulation { get; set; } //Lũy kế %
        public string PaymentAmount { get; set; } //Số tiền thanh toán

        public string ReceiveCode  { get; set; } //Mã số nhận hàng
        public string ReceiveDate { get; set; } //Ngày nhận hàng
        public string NumberOfTests { get; set; } //Số lượng nghiệm thu 
        public string AmountOfAcceptance { get; set; } //Số tiền nghiệm thu gồm thuế VAT  
        public int? AmountOfAcceptanceType { get; set; } //Loại tiền nghiệm thu gồm thuế VAT  

        public virtual Order Order { get; set; }
    }
}
