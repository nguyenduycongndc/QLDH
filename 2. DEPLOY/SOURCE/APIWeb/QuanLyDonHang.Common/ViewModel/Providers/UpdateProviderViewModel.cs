using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Providers
{
    public class UpdateProviderViewModel
    {
        public int ID { get; set; }
        [DisplayName("Mã nhà cc")]
        public string Code { get; set; }
        [DisplayName("Tên nhà cc")]
        public string Name { get; set; }
        [DisplayName("Mã số thuế")]
        public string Tax { get; set; }
        
        [DisplayName("Số điện thoại ncc")]
        public string PhoneNumber { get; set; }
        
        [DisplayName("Email ncc")]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Please enter a valid e-mail adress")]
        public string Email { get; set; }
        
        [DisplayName("Người liên hệ")]
        public string Contact { get; set; }
        
        [DisplayName("Số điện thoại liên hệ")]
        public string ContactPhoneNumber { get; set; }
        
        [DisplayName("Địa chỉ người liên hệ")]
        public string Address { get; set; }
        
        [DisplayName("Trụ sở liên hệ")]
        public string OfficeAddress { get; set; }
        
        [DisplayName("Fax")]
        public string Fax { get; set; }
        
        [DisplayName("Ngày đăng ký")]
        public string RegistrationDate { get; set; }
        
        [DisplayName("Loại công trình")]
        public string ContructionType { get; set; }
        
        [DisplayName("Loại sản phẩm")]
        public string ProductType { get; set; }
        
        [DisplayName("Người đại điện")]
        public string Representative { get; set; }
        
        [DisplayName("Chứng nhận sản phẩm")]
        public int CertificateProduct { get; set; }
        [DisplayName("Tên NCC (Tiếng Anh/Trung)")]
        public string SubName { get; set; }
        [DisplayName("Link Web")]
        public string Web { get; set; }
        [DisplayName("Vốn điều lệ")]
        public string CharterCapital { get; set; }
        [DisplayName("Loại tiền vốn điều lệ")]
        public int? MoneyTypeCharterCapital { get; set; }//loại tiền vốn điều lệ
        [DisplayName("Doanh thu")]
        public string Revenue { get; set; }
        [DisplayName("Loại tiền doanh thu")]
        public int? MoneyTypeRevenue { get; set; }//loại tiền doanh thu
        [DisplayName("Tên ngân hàng")]
        public string BankName { get; set; }
        [DisplayName("Số tài khoản")]
        public string AccountNumber { get; set; }
        [DisplayName("Loại hình")]
        public int Type { get; set; }
        [DisplayName("Ghi chú")]
        public string Note { get; set; }
        [DisplayName("Đơn vị tiền tệ vốn điều lệ")]
        public int? CapitalCurrency { get; set; }//đơn vị tiền tệ vốn điều lệ
        [DisplayName("Đơn vị tiền tệ doanh thu năm")]
        public int? RevenueCurrency { get; set; }//đơn vị tiền tệ doanh thu năm
        [DisplayName("SwiftCode")]
        public string SwiftCode { get; set; }
        public string EmailContactPerson { get; set; }//Email người liên hệ 
        public string EngName { get; set; }//Email người liên hệ 
    }
}
