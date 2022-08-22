using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Providers
{
    public class SearchProviderViewModel
    {   
        public int ID { get; set; }
        public int IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Representative { get; set; }
        public string Tax { get; set; }
        public string OfficeAddress { get; set; }
        public string Address { get; set; }
        public int CertificateProduct { get; set; }
        public int CreatedByID { get; set; }
        public string Fax { get; set; }
        public string Contact { get; set; }
        public string ContactPhoneNumber { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public string ProductType { get; set; }
        public string ContructionType { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int ModifiedByID { get; set; }
        public string SubName { get; set; }
        public string Web { get; set; }
        public string CharterCapital { get; set; }
        public int? MoneyTypeCharterCapital { get; set; }//loại tiền vốn điều lệ
        public string Revenue { get; set; }
        public int? MoneyTypeRevenue { get; set; }//loại tiền doanh thu
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public int Type { get; set; }
        public string Note { get; set; }
        public int? CapitalCurrency { get; set; }//đơn vị tiền tệ vốn điều lệ
        public int? RevenueCurrency { get; set; }//đơn vị tiền tệ doanh thu năm
        public string SwiftCode { get; set; }
        public string EmailContactPerson { get; set; }//Email người liên hệ 
        public string EngName { get; set; }//Tiếng anh 
    }
}
