using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Login
{
    public class LoginViewModel
    {
        [Required]
        [DisplayName("Số điện thoại")]
        public string PhoneNumber { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
