using QuanLyDonHang.Common.ViewModel.File;
using QuanLyDonHang.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Repository.Interfaces
{
    public interface IFileReponsitory : IRepository<UpFile>
    {
        public Task<List<FileModel>> DetailFile(int Id);
        Task AddNew(Upfile upfile);
    }
}
