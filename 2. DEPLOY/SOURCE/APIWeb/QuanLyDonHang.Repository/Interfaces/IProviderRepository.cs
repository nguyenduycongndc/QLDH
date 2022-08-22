using PagedList;
using QuanLyDonHang.Common.ViewModel.Providers;
using QuanLyDonHang.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Repository.Interfaces
{
    public interface IProviderRepository : IRepository<Provider>
    {
        public Task<IPagedList<SearchProviderViewModel>> SearchProvider(int Page, string str);
        public Task UpdateProvider(UpdateProviderViewModel p, int userId);
    }
}
