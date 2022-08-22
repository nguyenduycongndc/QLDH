using QuanLyDonHang.Domain;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Repository
{
    public class MoneyRepository : BaseRepository<Money>, IMoneyRepository
    {
        public MoneyRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}
