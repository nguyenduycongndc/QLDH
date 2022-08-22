using PagedList;
using QuanLyDonHang.Common.ViewModel.Orders;
using QuanLyDonHang.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Repository.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        public Task<int> CountCode(string Code);
        public Task<DetailOrderViewModel> GetOrderDetail(int Id);
        public Task<int> UpdateOrder(UpdateOrderViewModel o, int userId);
        public Task<IPagedList<SearchOrderParam>> SearchOrder(int page, int ProviderId, int Status, string Code, string FromDate, string ToDate);
        public Task<List<ExportOrder>> ExportOrder(List<int> list);
    }
}
