using PagedList;
using QuanLyDonHang.Common.ViewModel.Orders;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Service.Interface;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Interfaces
{
    public interface IOrderService : IServices<Order>
    {
        public Task<int> CreateOrder(AddOrderViewModel input, int userId);
        public Task<DetailOrderViewModel> GetOrderDetail(int Id);
        public Task<int> UpdateOrder(UpdateOrderViewModel o, int userId);
        public Task<IPagedList<SearchOrderParam>> SearchOrder(int page, int ProviderId,int Status, string Code, string FromDate, string Todate);
        public Task<List<ExportOrder>> ExportOrder(string listId);
    }
}
