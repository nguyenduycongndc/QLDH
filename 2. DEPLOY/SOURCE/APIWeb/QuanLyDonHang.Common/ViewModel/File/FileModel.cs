using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.File
{
    public class FileModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public int IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public int FolderId { get; set; }
        public IFormFile File { get; set; }
    }
    public class Upfile
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public int FolderId { get; set; }
        public IFormFile File { get; set; }

    }
    public class SaveFiModel
    {
        public string OriginalFileName { get; set; }
        public string FileName { get; set; }
        public long SizeFile { get; set; }
    }
}
