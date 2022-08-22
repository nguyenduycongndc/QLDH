using QuanLyDonHang.Common.ViewModel.File;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Service.Interface;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Interfaces
{
    //public interface IFileService : IServices<UpFile>
    //{
    //    public Task<List<FileModel>> DetailFile(int Id);
    //    string GetFileUrl(string fileName);
    //    Task SaveFileAsync(Stream mediaBinaryStrem, string fileName);
    //    Task DeleteFileAync(string fileName);
    //    Task<SaveFiModel> AddFileOrder(FileModel fileModel);
    //    Task<bool> DeleteFileOrder(string fileName);
    //}
    public interface IFileService : IServices<UpFile>
    {
        string GetFileUrl(string fileName);
        Task SaveFileAsync(Stream mediaBinaryStrem, string fileName);
        Task DeleteFileAync(string fileName);
        Task<SaveFiModel> AddFileOrder(Upfile fileModel);
        Task<bool> DeleteFileOrder(string fileName);
        public Task<List<FileModel>> DetailFile(int Id);
    }
}
