using QuanLyDonHang.Common.ViewModel.Folder;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Service.Interface;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Interfaces
{
    public interface IFolderService : IServices<Folder>
    {
        public Task<FoldersModel> ListFolder(int Id);
        //public Task<List<ListFolderModel>> ListFolder(int Id);
        public Task<ListFolderModel> DetailFolder(int Id);
        public Task<int> CreateFolder(AddFolderModel input, int userId);
        public Task<int> UpdateFolder(UpdateFolderModel input, int userId);
    }
}
