using QuanLyDonHang.Common.ViewModel.OrderDocument;
using QuanLyDonHang.Domain;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Repository
{
    public class OrderDocumentRepository : BaseRepository<OrderDocument>, IOrderDocumentRepository
    {
        public OrderDocumentRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
        //them du lieu file vao db
        public async Task AddNew(OrderDocumentModel orderDocument)
        {
            try
            {
                OrderDocument o = new OrderDocument() { 
                    Name = orderDocument.Name,
                    Path = orderDocument.Path,
                    OrderId = orderDocument.OrderId
                };

                DbContext.Add(o);
                await DbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
