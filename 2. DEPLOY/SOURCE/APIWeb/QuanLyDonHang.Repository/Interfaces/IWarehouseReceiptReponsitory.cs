using PagedList;
using QuanLyDonHang.Common.ViewModel.WarehouseReceipt;
using QuanLyDonHang.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Repository.Interfaces
{
    public interface IWarehouseReceiptReponsitory : IRepository<WarehouseReceipt>
    {
        public Task<DetailProviderNameModel> DetailProviderName(int Id);
        public Task UpdateWarehouseReceipt(UpdateWarehouseReceiptModel w, int userId);
        public Task<IPagedList<SearchWarehouseReceiptModel>> SearchWarehouseReceipt(int page, int ProviderId, string Code, string FromDate, string ToDate);
        public Task<List<ExportWarehouseReceiptModel>> ExportWarehouseReceipt(List<int> list);
    }
}
