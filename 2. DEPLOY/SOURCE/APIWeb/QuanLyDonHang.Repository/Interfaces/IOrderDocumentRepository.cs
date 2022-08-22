using QuanLyDonHang.Common.ViewModel.OrderDocument;
using QuanLyDonHang.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Repository.Interfaces
{
    public interface IOrderDocumentRepository : IRepository<OrderDocument>
    {
        Task AddNew(OrderDocumentModel orderDocument);
    }
}
