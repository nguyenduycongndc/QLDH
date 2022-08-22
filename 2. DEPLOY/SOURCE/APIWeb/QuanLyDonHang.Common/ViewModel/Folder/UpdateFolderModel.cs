using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Folder
{
    public class UpdateFolderModel
    {
        public int Id { get; set; }
        public string UpdateFolderName { get; set; }
        public int UpdateParentId { get; set; }
    }
}
