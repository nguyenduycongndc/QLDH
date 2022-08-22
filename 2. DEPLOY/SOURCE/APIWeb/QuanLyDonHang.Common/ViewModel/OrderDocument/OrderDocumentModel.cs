using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.OrderDocument
{
    public class OrderDocumentModel
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public int? OrderId { get; set; }
        public IFormFile File { get; set; }
        
    }

    public class SaveFileModel
    {
        public string OriginalFileName { get; set; }
        public string FileName { get; set; }
        public long SizeFile { get; set; }
    }
}
