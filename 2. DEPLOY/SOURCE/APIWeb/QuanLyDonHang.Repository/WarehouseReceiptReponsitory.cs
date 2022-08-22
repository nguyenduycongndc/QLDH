using QuanLyDonHang.Common.ViewModel.WarehouseReceipt;
using QuanLyDonHang.Domain;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using QuanLyDonHang.Common.ViewModel.Orders;
using QuanLyDonHang.Common.Utils;
using PagedList;

namespace QuanLyDonHang.Repository
{
    public class WarehouseReceiptReponsitory : BaseRepository<WarehouseReceipt>, IWarehouseReceiptReponsitory
    {
        public WarehouseReceiptReponsitory(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<DetailProviderNameModel> DetailProviderName(int Id)
        {
            try
            {
                var query = await (from o in DbContext.Orders
                                   where o.ID.Equals(Id)
                                   select new DetailProviderNameModel
                                   {
                                       OrderId = o.ID,
                                       ProviderId = o.ProviderID,
                                       Description = o.Description,
                                       OrderCode = DbContext.Orders.Where(p => p.IsActive.Equals(1) && p.ID.Equals(o.ID)).Select(p => p.Code).FirstOrDefault(),
                                       //OrderId = o.OrderId,
                                       //Content = o.Content,
                                       ProviderName = DbContext.Providers.Where(p => p.IsActive.Equals(1) && p.ID.Equals(o.ProviderID)).Select(p => p.Name).FirstOrDefault(),
                                       DeadlineDate = o.DeadlineDate.HasValue ? o.DeadlineDate.Value.ToString("dd/MM/yyyy"): "",
                                       //ProviderName = o.Name,
                                   }).FirstOrDefaultAsync();
                return query;
            }
            catch
            {
                return new DetailProviderNameModel();
            }
        }
        public async Task UpdateWarehouseReceipt(UpdateWarehouseReceiptModel w, int userId)
        {
            try
            {
                var pro = await DbContext.warehouseReceipts.FindAsync(w.ID);
                pro.OrderId = w.OrderId;
                pro.OrderCode = w.OrderCode;
                pro.ProviderId = w.ProviderId;
                pro.ProviderName = w.ProviderName;
                pro.Content = w.Content;
                pro.ConstructionDate = Util.ConvertDate(w.ConstructionDate);
                pro.ETD = Util.ConvertDate(w.ETD);
                pro.ETA = Util.ConvertDate(w.ETA);
                pro.PortExport = w.PortExport;
                pro.ContNumber = w.ContNumber;
                pro.RealityETD = Util.ConvertDate(w.RealityETD);
                pro.RealityETA = Util.ConvertDate(w.RealityETA);
                pro.RealityDate = Util.ConvertDate(w.RealityDate);
                pro.Note = w.Note;
                pro.DeliveryProgress = w.DeliveryProgress;
                pro.OrderMoney = w.OrderMoney;
                pro.OrderMoneyType = w.OrderMoneyType;
                pro.TermsOfSale = w.TermsOfSale;
                pro.ShippingDocuments = w.ShippingDocuments;
                pro.AgentMoney = w.AgentMoney;
                pro.AgentMoneyType = w.AgentMoneyType;
                pro.OtherMoney = w.OtherMoney;
                pro.OtherMoneyType = w.OtherMoneyType;
                pro.PaymentTerms = w.PaymentTerms;
                await DbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                ex.ToString();
            }
        }
        public async Task<IPagedList<SearchWarehouseReceiptModel>> SearchWarehouseReceipt(int page, int ProviderId, string Code, string FromDate, string ToDate)
        {
            try
            {
                DateTime? fd = Util.ConvertDate(FromDate);
                DateTime? td = Util.ConvertDate(ToDate);
                if (td.HasValue)
                    td = td.Value.AddDays(1);
                var query = await (from x in DbContext.warehouseReceipts
                                   where x.IsActive == 1
                                   orderby x.CreatedDate descending
                                   select new SearchWarehouseReceiptModel
                                   {
                                       ID = x.ID,
                                       OrderId = x.OrderId,
                                       Code = x.OrderCode,
                                       //Code = DbContext.Orders.Where(p => p.IsActive.Equals(1) && p.ID.Equals(x.OrderId)).Select(p => p.Code).FirstOrDefault(),
                                       ProviderId = x.ProviderId,
                                       ProviderName = x.ProviderName,
                                       Content = x.Content,
                                       ConstructionDate = x.ConstructionDate.HasValue ? x.ConstructionDate.Value.ToString("dd/MM/yyyy"): "",
                                       ETD = x.ETD,
                                       ETA = x.ETA,
                                       PortExport = x.PortExport,
                                       ContNumber = x.ContNumber,
                                       RealityETD = x.RealityETD,
                                       RealityETA = x.RealityETA,
                                       RealityDate = x.RealityDate,
                                       Note = x.Note,
                                       CreatedDate = x.CreatedDate,
                                       TermsOfSale = x.TermsOfSale,
                                       ShippingDocuments = x.ShippingDocuments,
                                       AgentMoney = x.AgentMoney,
                                       AgentMoneyType = x.AgentMoneyType,
                                       OtherMoney = x.OtherMoney,
                                       OtherMoneyType = x.OtherMoneyType,
                                       PaymentTerms = x.PaymentTerms,
                                       OrderMoney = x.OrderMoney,
                                       OrderMoneyType = x.OrderMoneyType,
                                       DeliveryProgress = x.DeliveryProgress,
                                   }).ToListAsync();
                var a = query;
                if (!String.IsNullOrEmpty(Code)) query = query.Where(x => x.Code.Contains(Code)).ToList();
                if (ProviderId != -1) query = query.Where(p => p.ProviderId.Equals(ProviderId)).ToList();
                if (fd != null) query = query.Where(p => p.CreatedDate >= fd.Value).ToList();
                if (td != null) query = query.Where(p => p.CreatedDate <= td.Value).ToList();
                return query.ToPagedList(page, 20);
            }
            catch (Exception ex)
            {
                return new List<SearchWarehouseReceiptModel>().ToPagedList(1, 1);
            }
        }
        public async Task<List<ExportWarehouseReceiptModel>> ExportWarehouseReceipt(List<int> list)
        {
            try
            {
                List<ExportWarehouseReceiptModel> array = new List<ExportWarehouseReceiptModel>();
                int dem = 1;
                foreach (int i in list)
                {
                    var ware = await DbContext.warehouseReceipts.FindAsync(i);
                    ExportWarehouseReceiptModel s = new ExportWarehouseReceiptModel();
                    s.STT = dem;
                    s.Code = await DbContext.Orders.Where(p => p.IsActive.Equals(1) && p.ID.Equals(ware.OrderId)).Select(p => p.Code).FirstOrDefaultAsync();
                    s.ProviderName = ware.ProviderName;
                    s.Content = ware.Content;
                    s.ConstructionDate = ware.ConstructionDate;
                    s.ETD = ware.ETD;
                    s.ETA = ware.ETA;
                    s.PortExport = ware.PortExport;
                    s.ContNumber = ware.ContNumber;
                    s.RealityETD = ware.RealityETD;
                    s.RealityETA = ware.RealityETA;
                    s.RealityDate = ware.RealityDate;
                    s.Note = ware.Note;
                    s.CreatedDate = ware.CreatedDate;
                    dem++;
                    array.Add(s);
                }
                return array;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<ExportWarehouseReceiptModel>();
            }
        }
    }
}
