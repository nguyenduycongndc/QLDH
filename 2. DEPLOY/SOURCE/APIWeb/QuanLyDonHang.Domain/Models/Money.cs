using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Domain.Models
{
    public class Money : BaseModel
    {
        public string Name { get; set; }
        public virtual ICollection<Order> Orders { get; set; }

    }
}
