using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Domain.Models
{
    public class OrderDocument : BaseModel
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public int? OrderId { get; set; }
        public virtual Order Orders { get; set; }
    }
}
