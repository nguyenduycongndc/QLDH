using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Domain.Models
{
    public class UpFile : BaseModel
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public int FolderId { get; set; }
        public virtual Folder Folder { get; set; }
    }
}
