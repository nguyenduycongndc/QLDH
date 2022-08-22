using QuanLyDonHang.Common.ViewModel.File;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel.Folder
{
    public class ListFolderModel
    {

        public int ID { get; set; }
        public string Name { get; set; }
        public int ParentId { get; set; }
        public int IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<FolderDetail> folderDetails { get; set; }
        public List<FileDetail> fileDetails { get; set; }
    }
    public class FoldersModel
    {
        public List<ListFolderModel> listFolders { get; set; }
        public List<FileModel> listFiles { get; set; }
    }

    public class FolderDetail
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int ParentId { get; set; }
        public int IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }
    public class FileDetail
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public int IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? FolderId { get; set; }
    }
}
