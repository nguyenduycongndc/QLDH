using PagedList;
using QuanLyDonHang.Common.ViewModel.WarehouseReceipt;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Service.Interface;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Interfaces
{
    public interface IWarehouseReceiptService : IServices<WarehouseReceipt>
    {
        public Task<int> CreateWarehouseReceipt(AddWarehouseReceiptModel input, int userId);
        public Task<DetailProviderNameModel> DetailProviderName(int Id);
        public Task<int> UpdateWarehouseReceipt(UpdateWarehouseReceiptModel input, int userId);
        public Task<IPagedList<SearchWarehouseReceiptModel>> SearchWarehouseReceipt(int page, int ProviderId, string Code, string FromDate, string ToDate);
        public Task<List<ExportWarehouseReceiptModel>> ExportWarehouseReceipt(string listId);
    }
}
