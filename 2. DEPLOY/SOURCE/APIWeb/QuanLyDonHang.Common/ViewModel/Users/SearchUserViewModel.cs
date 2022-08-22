using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Users
{
    public class SearchUserViewModel
    {
        public string NameOrPhone { get; set; }
        public int Role { get; set; }
        public int IsActive { get; set; }
    }
}
