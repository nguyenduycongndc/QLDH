using QuanLyDonHang.Domain;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Repository
{
    public class OrderPaymentRepository : BaseRepository<OrderPayment>, IOrderPaymentRepository
    {
        public OrderPaymentRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}
