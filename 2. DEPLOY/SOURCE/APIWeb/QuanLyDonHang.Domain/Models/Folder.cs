using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Domain.Models
{
    public class Folder : BaseModel
    {
        public string Name { get; set; }
        public int ParentId { get; set; }
    }
}
