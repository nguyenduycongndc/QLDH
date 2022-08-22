using QuanLyDonHang.Domain;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using QuanLyDonHang.Common.ViewModel.Orders;
using QuanLyDonHang.Common.Utils;
using PagedList;

namespace QuanLyDonHang.Repository
{
    public class OrderRepository : BaseRepository<Order>, IOrderRepository
    {
        public OrderRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<int> CountCode(string Code)
        {
            try
            {
                Code = Code + "_";
                var data = await (from o in DbContext.Orders
                                  where o.IsActive.Equals(1) && o.Code.Contains(Code)
                                  select o).CountAsync();
                return data;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public async Task<List<ExportOrder>> ExportOrder(List<int> list)
        {
            try
            {
                List<ExportOrder> array = new List<ExportOrder>();
                int dem = 1;
                foreach (int i in list)
                {
                    var order = await DbContext.Orders.FindAsync(i);
                    ExportOrder s = new ExportOrder();
                    s.STT = dem;
                    s.Code = order.Code;
                    s.ContructionName = order.ContructionName;
                    s.ContactCode = order.ContactCode;
                    s.ProviderName = await DbContext.Providers.Where(p => p.IsActive.Equals(1) && p.ID.Equals(order.ProviderID)).Select(p => p.Name).FirstOrDefaultAsync();
                    //s.CreatedBy = await DbContext.Users.Where(x => x.IsActive.Equals(1) && x.ID.Equals(order.CreatedByID)).Select(x => x.Username).FirstOrDefaultAsync();
                    s.CreatedDate = order.CreatedDate.ToString("dd/MM/yyyy");
                    s.DeadlineDate = order.DeadlineDate.HasValue ? order.DeadlineDate.Value.ToString() : "";
                    s.Content = order.Description;
                    //s.ModifiedBy =  order.ModifiedByID.HasValue ? await DbContext.Users.Where(x => x.IsActive.Equals(1) && x.ID.Equals(order.ModifiedByID.Value)).Select(x => x.Username).FirstOrDefaultAsync() : "";
                    //s.ModifiedDate = order.ModifiedDate.HasValue?order.ModifiedDate.Value.ToString("dd/MM/yyyy"):"";
                    dem++;
                    array.Add(s);
                }
                return array;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<ExportOrder>();
            }
        }

        public async Task<DetailOrderViewModel> GetOrderDetail(int Id)
        {
            try
            {
                var query = await (from o in DbContext.Orders
                                   join wr in DbContext.warehouseReceipts on o.ID equals wr.OrderId
                                   into orl
                                   from wr in orl.DefaultIfEmpty()
                                   where o.ID.Equals(Id)
                                   select new DetailOrderViewModel
                                   {
                                       ID = o.ID,
                                       Code = o.Code,
                                       ProviderID = o.ProviderID,
                                       ContructionName = o.ContructionName,
                                       ContructionType = o.ContructionType,
                                       AmountBeforeTax = o.AmountBeforeTax,
                                       MoneyTypeID = o.MoneyTypeID.Value,
                                       DeadlineDate = o.DeadlineDate.HasValue ? o.DeadlineDate.Value.ToString("dd/MM/yyyy") : "",
                                       OutOfDate = o.outOfDate.Value,
                                       WarrantyPeriod = o.Warranty.Value,
                                       ContactCode = o.ContactCode,
                                       IsImport = o.IsImport,
                                       ProductType = o.ProductType,
                                       Description = o.Description,
                                       Status = o.Status,
                                       AmountAfterTax = o.AmountAfterTax,
                                       Rate = o.Rate,
                                       PaymentTerms = o.PaymentTerms,
                                       ConstructionCode = o.ConstructionCode,
                                       WarehouseReceiptID = wr.ID,
                                       Path = DbContext.OrderDocuments.Where(x => x.OrderId.Equals(o.ID)).Select(x => x.Path).FirstOrDefault(),

                                       EstimatedCategory = o.EstimatedCategory,
                                       EstimatedName = o.EstimatedName,
                                       AmountMoney = o.AmountMoney,
                                       AmountMoneyType = o.AmountMoneyType,

                                       orderPaymentDetails = DbContext.OrderPayments.Where(x => x.OrderId.Equals(o.ID) && x.Percent != null).Select(x => new OrderPaymentDetail
                                       {
                                           OrderPaymentId = x.ID,
                                           PaymentDate = x.PaymentDate,
                                           PaymentType = x.PaymentType,
                                           Percent = x.Percent,
                                           MoneyAccumulation = x.MoneyAccumulation,
                                           PercentAccumulation = x.PercentAccumulation,
                                           PaymentAmount = x.PaymentAmount,
                                           ReceiveCode = x.ReceiveCode,
                                           ReceiveDate = x.ReceiveDate,
                                           NumberOfTests = x.NumberOfTests,
                                           AmountOfAcceptance = x.AmountOfAcceptance,
                                           AmountOfAcceptanceType = x.AmountOfAcceptanceType,
                                       }).ToList(),
                                   }).FirstOrDefaultAsync();
                return query;
            }
            catch
            {
                return new DetailOrderViewModel();
            }
        }

        public async Task<IPagedList<SearchOrderParam>> SearchOrder(int page, int ProviderId, int Status, string Code, string FromDate, string ToDate)
        {
            try
            {
                DateTime? fd = Util.ConvertDate(FromDate);
                DateTime? td = Util.ConvertDate(ToDate);
                if (td.HasValue)
                    td = td.Value.AddDays(1);
                var query = await (from x in DbContext.Orders
                                   where x.IsActive == 1
                                   orderby x.CreatedDate descending
                                   select new SearchOrderParam
                                   {
                                       Id = x.ID,
                                       Code = x.Code,
                                       ContructionName = x.ContructionName,
                                       Status = x.Status,
                                       DeadlineDate = x.DeadlineDate,
                                       ContactCode = x.ContactCode,
                                       ProviderName = DbContext.Providers.Where(p => p.IsActive.Equals(1) && p.ID.Equals(x.ProviderID)).Select(p => p.Name).FirstOrDefault(),
                                       ProviderCode = DbContext.Providers.Where(p => p.IsActive.Equals(1) && p.ID.Equals(x.ProviderID)).Select(p => p.Code).FirstOrDefault(),
                                       CreatedBy = DbContext.Users.Where(u => u.ID.Equals(x.CreatedByID)).Select(x => x.Username).FirstOrDefault(),
                                       CreatedById = x.CreatedByID,
                                       CreatedDate = x.CreatedDate,
                                       ModifiedBy = x.ModifiedByID.HasValue ? DbContext.Users.Where(u => u.ID.Equals(x.ModifiedByID.Value)).Select(x => x.Username).FirstOrDefault() : "",
                                       ModifiedDate = x.ModifiedDate.Value,
                                       ModifiedById = x.ModifiedByID,
                                       ProviderId = x.ProviderID,
                                       AmountBeforeTax = x.AmountBeforeTax,
                                       AmountAfterTax = x.AmountAfterTax,
                                       Warranty = x.Warranty,
                                       outOfDate = x.outOfDate,
                                       IsImport = x.IsImport,
                                       ProductType = x.ProductType,
                                       ContructionType = x.ContructionType,
                                       PaymentTerms = x.PaymentTerms,
                                       Rate = x.Rate,
                                       MoneyTypeID = x.MoneyTypeID,
                                       ConstructionCode = x.ConstructionCode,
                                       Description = x.Description,

                                       EstimatedCategory = x.EstimatedCategory,
                                       EstimatedName = x.EstimatedName,
                                       AmountMoney = x.AmountMoney,
                                       AmountMoneyType = x.AmountMoneyType,

                                       orderPaymentDetails = DbContext.OrderPayments.Where(y => y.OrderId.Equals(x.ID) && y.Percent != null).Select(y => new OrderPaymentDetail
                                       {
                                           OrderPaymentId = y.ID,
                                           PaymentDate = y.PaymentDate,
                                           PaymentType = y.PaymentType,
                                           Percent = y.Percent,
                                           MoneyAccumulation = y.MoneyAccumulation,
                                           PercentAccumulation = y.PercentAccumulation,
                                           PaymentAmount = y.PaymentAmount,
                                           ReceiveCode = y.ReceiveCode,
                                           ReceiveDate = y.ReceiveDate,
                                           NumberOfTests = y.NumberOfTests,
                                           AmountOfAcceptance = y.AmountOfAcceptance,
                                           AmountOfAcceptanceType = y.AmountOfAcceptanceType,
                                       }).ToList(),
                                   }).ToListAsync();
                if (Code != "" && Code != null) query = query.Where(x => x.Code.Contains(Code)).ToList();
                if (ProviderId != -1) query = query.Where(p => p.ProviderId.Equals(ProviderId)).ToList();
                if (Status != -1) query = query.Where(p => p.Status.Equals(Status)).ToList();
                if (fd != null) query = query.Where(p => p.CreatedDate >= fd.Value).ToList();
                if (td != null) query = query.Where(p => p.CreatedDate <= td.Value).ToList();
                return query.ToPagedList(page, 20);
            }
            catch (Exception ex)
            {
                return new List<SearchOrderParam>().ToPagedList(1, 1);
            }
        }

        public async Task<int> UpdateOrder(UpdateOrderViewModel o, int userId)
        {
            try
            {
                var data = await DbContext.Orders.FindAsync(o.ID);
                data.ProviderID = o.ProviderID;
                data.ContructionName = o.ContructionName;
                data.ContructionType = o.ContructionType;
                data.AmountBeforeTax = o.AmountBeforeTax;
                data.MoneyTypeID = o.MoneyTypeID;
                data.DeadlineDate = Util.ConvertDate(o.DeadlineDate);
                data.outOfDate = o.OutOfDate;
                data.Warranty = o.WarrantyPeriod;
                data.ContactCode = o.ContactCode;
                data.IsImport = o.IsImport;
                data.ProductType = o.ProductType;
                data.Description = o.Description;
                data.ModifiedByID = userId;
                data.ModifiedDate = DateTime.Now;
                data.Status = o.Status;
                data.AmountAfterTax = o.AmountAfterTax;
                data.Rate = o.Rate;
                data.PaymentTerms = o.PaymentTerms;
                data.ConstructionCode = o.ConstructionCode;

                data.EstimatedCategory = o.EstimatedCategory;
                data.EstimatedName = o.EstimatedName;
                data.AmountMoney = o.AmountMoney;
                data.AmountMoneyType = o.AmountMoneyType;

                var document = await DbContext.OrderDocuments.Where(x => x.IsActive.Equals(1) && x.OrderId.Equals(data.ID)).Select(x => x).FirstOrDefaultAsync();
                document.Path = o.Path;
                var payments = await DbContext.OrderPayments.Where(x => x.IsActive.Equals(1) && x.OrderId.Equals(data.ID)).ToListAsync();
                if (o.orderPaymentUpdates != null)
                {
                    foreach (var item in o.orderPaymentUpdates)
                    {
                        if (item.OrderPaymentId != null)
                        {
                            var ck = payments.FirstOrDefault(x => x.ID == item.OrderPaymentId);
                            if (ck != null)
                            {
                                ck.Percent = item.Percent;
                                ck.PaymentDate = item.PaymentDate;
                                ck.PaymentType = item.PaymentType;
                                ck.MoneyAccumulation = item.MoneyAccumulation;
                                ck.PercentAccumulation = item.PercentAccumulation;
                                ck.PaymentAmount = item.PaymentAmount;
                                ck.ReceiveCode = item.ReceiveCode;
                                ck.ReceiveDate = item.ReceiveDate;
                                ck.NumberOfTests = item.NumberOfTests;
                                ck.AmountOfAcceptance = item.AmountOfAcceptance;
                                ck.AmountOfAcceptanceType = item.AmountOfAcceptanceType;
                            }
                        }
                        else
                        {
                            OrderPayment op1 = new OrderPayment();
                            op1.OrderId = o.ID;
                            op1.IsActive = 1;
                            op1.CreatedDate = DateTime.Now;
                            op1.PaymentDate = item.PaymentDate;
                            op1.Percent = item.Percent;
                            op1.PaymentType = item.PaymentType;
                            op1.MoneyAccumulation = item.MoneyAccumulation;
                            op1.PercentAccumulation = item.PercentAccumulation;
                            op1.PaymentAmount = item.PaymentAmount;
                            op1.ReceiveCode = item.ReceiveCode;
                            op1.ReceiveDate = item.ReceiveDate;
                            op1.NumberOfTests = item.NumberOfTests;
                            op1.AmountOfAcceptance = item.AmountOfAcceptance;
                            op1.AmountOfAcceptanceType = item.AmountOfAcceptanceType;
                            DbContext.OrderPayments.Add(op1);
                        }
                    }
                }

                await DbContext.SaveChangesAsync();
                return SystemParam.SUCCESS;
            }
            catch (Exception ex)
            {
                return SystemParam.ERROR;
            }
        }
    }
}
