using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel
{
    public class AddUserViewModel
    {
        [Required]
        [DisplayName("Tên nhân viên")]
        public string UserName { get; set; }
        [Required]
        [DisplayName("Số điện thoại")]
        public string PhoneNumber { get; set; }
        [Required]
        [DisplayName("Địa chỉ mail")]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Please enter a valid e-mail adress")]
        public string Email { get; set; }
        [Required]
        [DisplayName("Password")]
        [StringLength(20, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 8)]
        public string Password { get; set; }
        [Required]
        [DisplayName("Mật khẩu xác nhận lại")]
        [Compare("Password",ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
        public int checkRole { get; set; }//quyền tài khoản có thể xóa đơn hàng {1/0}

    }
}
