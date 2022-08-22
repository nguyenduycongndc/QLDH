using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Domain.Models
{
    public class User : BaseModel
    {

        public string Username { get; set; }
        public string PhoneNumber { get; set; }
        public int Role { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }
        public string PasswordToken { get; set; }
        public DateTime? ExpPasswordToken { get; set; }
        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int checkRole { get; set; }//quyền tài khoản có thể xóa đơn hàng {1/0}
    }
}
