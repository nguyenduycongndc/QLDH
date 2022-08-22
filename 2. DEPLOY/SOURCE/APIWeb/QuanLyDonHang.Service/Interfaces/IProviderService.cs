using PagedList;
using QuanLyDonHang.Common.ViewModel.Providers;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Service.Interface;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Interfaces
{
    public interface IProviderService : IServices<Provider>
    {
        public Task<int> AddProvider(AddProviderViewModel input, int userId);
        public Task<int> UpdateProvider(UpdateProviderViewModel input, int userId);
        public Task<IPagedList<SearchProviderViewModel>> SearchProvider(int Page, string str);
    }
}
