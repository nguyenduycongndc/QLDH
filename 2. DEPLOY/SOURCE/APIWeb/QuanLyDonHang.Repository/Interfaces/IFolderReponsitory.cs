using PagedList;
using QuanLyDonHang.Common.ViewModel.Folder;
using QuanLyDonHang.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Repository.Interfaces
{
    public interface IFolderReponsitory : IRepository<Folder>
    {
        public Task<FoldersModel> List(int Id);
        //public Task<List<ListFolderModel>> List(int Id);
        public Task<ListFolderModel> DetailFolder(int Id);
        public Task UpdateFolder(UpdateFolderModel input, int userId);
    }
}
