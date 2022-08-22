using Microsoft.AspNetCore.Http;
using QuanLyDonHang.Common.ViewModel.OrderDocument;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Service.Interface;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Interfaces
{
    public interface IOrderDocumentService : IServices<OrderDocument>
    {
        string GetFileUrl(string fileName);
        Task SaveFileAsync(Stream mediaBinaryStrem, string fileName);
        Task DeleteFileAync(string fileName);
        Task<SaveFileModel> AddFileOrder(OrderDocumentModel orderDocument);
        Task<bool> DeleteFileOrder(string fileName);
    }
}
