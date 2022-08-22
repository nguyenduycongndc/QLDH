using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Users
{
    public class UserDetailViewModel
    {
        public int ID { get; set; }
        public string Username { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public int Status { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? checkRole { get; set; }//quyền tài khoản có thể xóa đơn hàng {1/0}

    }
}
