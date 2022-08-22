using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Service.Interface;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Interfaces
{
    public interface IMoneyService : IServices<Money>
    {
        public Task<List<MoneyViewModel>> GetMoneyViewModels();
    }
}
