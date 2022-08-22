using AutoMapper;
using PagedList;
using QuanLyDonHang.Common.Utils;
using QuanLyDonHang.Common.ViewModel.WarehouseReceipt;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Services
{
    public class WarehouseReceiptService : EcommerceServices<WarehouseReceipt>, IWarehouseReceiptService
    {
        private readonly IWarehouseReceiptReponsitory _warehouseReceiptReponsitory;
        private readonly IMapper _mapper;
        public WarehouseReceiptService(IWarehouseReceiptReponsitory warehouseReceiptReponsitory, IMapper mapper) : base(warehouseReceiptReponsitory)
        {
            _warehouseReceiptReponsitory = warehouseReceiptReponsitory;
            _mapper = mapper;
        }

        public async Task<int> CreateWarehouseReceipt(AddWarehouseReceiptModel input, int userId)
        {
            try
            {
                WarehouseReceipt fo = new WarehouseReceipt()
                {
                    OrderId = input.OrderId,
                    OrderCode = input.OrderCode,
                    ProviderId = input.ProviderId,
                    ProviderName = input.ProviderName,
                    Content = input.Content,
                    ConstructionDate = Util.ConvertDate(input.ConstructionDate),
                    ETD = Util.ConvertDate(input.ETD),
                    ETA = Util.ConvertDate(input.ETA),
                    PortExport = input.PortExport,
                    ContNumber = input.ContNumber,
                    RealityETD = Util.ConvertDate(input.RealityETD),
                    RealityETA = Util.ConvertDate(input.RealityETA),
                    RealityDate = Util.ConvertDate(input.RealityDate),
                    Note = input.Note,
                    DeliveryProgress = input.DeliveryProgress,
                    OrderMoney = input.OrderMoney,
                    OrderMoneyType = input.OrderMoneyType,
                    CreatedDate = DateTime.Now,
                    IsActive = 1,
                    TermsOfSale = input.TermsOfSale,
                    ShippingDocuments = input.ShippingDocuments,
                    AgentMoney = input.AgentMoney,
                    AgentMoneyType = input.AgentMoneyType,
                    OtherMoneyType = input.OtherMoneyType,
                    PaymentTerms = input.PaymentTerms,
                };
                await _warehouseReceiptReponsitory.AddAsync(fo);
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }
        public async Task<DetailProviderNameModel> DetailProviderName(int Id)
        {
            try
            {
                var data = await _warehouseReceiptReponsitory.DetailProviderName(Id);
                return data;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<int> UpdateWarehouseReceipt(UpdateWarehouseReceiptModel input, int userId)
        {
            try
            {
                await _warehouseReceiptReponsitory.UpdateWarehouseReceipt(input, userId);
                return SystemParam.SUCCESS;
            }
            catch (Exception ex)
            {
                return SystemParam.ERROR;
            }
        }
        public async Task<IPagedList<SearchWarehouseReceiptModel>> SearchWarehouseReceipt(int page, int ProviderId, string Code, string FromDate, string ToDate)
        {
            try
            {
                return await _warehouseReceiptReponsitory.SearchWarehouseReceipt(page, ProviderId, Code, FromDate, ToDate);
            }
            catch (Exception ex)
            {
                return new List<SearchWarehouseReceiptModel>().ToPagedList(1, 1);
            }
        }
        public async Task<List<ExportWarehouseReceiptModel>> ExportWarehouseReceipt(string listId)
        {
            try
            {
                string[] s = listId.Split(',');
                List<int> list = new List<int>();
                for (int i = 0; i < s.Length; i++)
                {
                    list.Add(Int32.Parse(s[i]));
                }
                return await _warehouseReceiptReponsitory.ExportWarehouseReceipt(list);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return null;
            }
        }
    }
}
