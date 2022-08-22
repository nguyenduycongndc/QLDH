using AutoMapper;
using PagedList;
using QuanLyDonHang.Common.Utils;
using QuanLyDonHang.Common.ViewModel.Orders;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Services
{
    public class OrderService : EcommerceServices<Order>, IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderDocumentRepository _orderDocumentRepository;
        private readonly IOrderPaymentRepository _orderPaymentRepository;
        private readonly IConfigRepository _configRepository;
        private readonly IMapper _mapper;
        public OrderService(IConfigRepository configRepository, IOrderRepository orderRepository, IOrderDocumentRepository orderDocumentRepository, IOrderPaymentRepository orderPaymentRepository, IMapper mapper) : base(orderRepository)
        {
            _orderRepository = orderRepository;
            _orderDocumentRepository = orderDocumentRepository;
            _orderPaymentRepository = orderPaymentRepository;
            _configRepository = configRepository;
            _mapper = mapper;
        }

        public async Task<int> CreateOrder(AddOrderViewModel input, int userId)
        {
            try
            {
                int? a = 0;
                var config = _configRepository.GetById(1);
                string s = config.Code;
                var index = await _orderRepository.CountCode(s) + 1;
                string autoIndex = index.ToString();
                if (index <= 9)
                {
                    autoIndex = "00" + autoIndex;
                }
                else if (index <= 99)
                {
                    autoIndex = "0" + autoIndex;
                }
                var o = new Order()
                {
                    Code = s + "_" + autoIndex,
                    ProviderID = input.ProviderID,
                    ContructionName = input.ContructionName,
                    ContructionType = input.ContructionType,
                    AmountBeforeTax = input.AmountBeforeTax,
                    MoneyTypeID = input.MoneyTypeID,
                    DeadlineDate = input.DeadlineDate == ""? null : Util.ConvertDate(input.DeadlineDate),
                    outOfDate = input.OutOfDate,
                    Warranty = input.WarrantyPeriod,
                    ContactCode = input.ContactCode,
                    IsImport = input.IsImport,
                    IsActive = 1,
                    ProductType = input.ProductType,
                    Description = input.Description,
                    CreatedByID = userId,
                    CreatedDate = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    ModifiedByID = userId,
                    Status = input.Status,
                    AmountAfterTax = input.AmountAfterTax,
                    Rate = input.Rate,
                    PaymentTerms = input.PaymentTerms,
                    ConstructionCode = input.ConstructionCode,
                    EstimatedCategory = input.EstimatedCategory,
                    EstimatedName = input.EstimatedName,
                    AmountMoney = input.AmountMoney,
                    AmountMoneyType = input.AmountMoneyType,
                };
                var res = await _orderRepository.AddAsync(o);
                OrderDocument od = new OrderDocument();
                od.OrderId = res.ID;
                od.Path = input.Path;
                od.IsActive = 1;
                od.CreatedDate = DateTime.Now;
                var sc = await _orderDocumentRepository.AddAsync(od);
                List<OrderPayment> listOp = new List<OrderPayment>();

                //op1.PaymentDate = Util.ConvertDate(input.PaymentDate1);
                //op1.PaymentType = 1;

                if (input.orderPaymentCreates.Count > 0)
                {
                    foreach (var item in input.orderPaymentCreates)
                    {
                        OrderPayment op1 = new OrderPayment();
                        op1.OrderId = res.ID;
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

                        listOp.Add(op1);
                    }
                }


                //OrderPayment op2 = new OrderPayment();
                //op2.OrderId = res.ID;
                //op2.IsActive = 1;
                //op2.CreatedDate = DateTime.Now;
                ////op2.PaymentDate = Util.ConvertDate(input.PaymentDate2);
                //op2.PaymentDate = input.PaymentDate2;
                //op2.PaymentType = 2;
                //op2.Percent = input.Payment2;
                //listOp.Add(op2);

                //OrderPayment op3 = new OrderPayment();
                //op3.OrderId = res.ID;
                //op3.IsActive = 1;
                //op3.CreatedDate = DateTime.Now;
                ////op3.PaymentDate = Util.ConvertDate(input.PaymentDate3);
                //op3.PaymentDate = input.PaymentDate3;
                //op3.PaymentType = 3;
                //op3.Percent = input.Payment3;
                //listOp.Add(op3);

                await _orderPaymentRepository.AddManyAsync(listOp);
                return SystemParam.SUCCESS;
            }
            catch (Exception ex)
            {
                return SystemParam.ERROR;
            }
        }

        public async Task<List<ExportOrder>> ExportOrder(string listId)
        {
            try
            {
                string[] s = listId.Split(',');
                List<int> list = new List<int>();
                for (int i = 0; i < s.Length; i++)
                {
                    list.Add(Int32.Parse(s[i]));
                }
                return await _orderRepository.ExportOrder(list);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

        public async Task<DetailOrderViewModel> GetOrderDetail(int Id)
        {
            try
            {
                var data = await _orderRepository.GetOrderDetail(Id);
                return data;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IPagedList<SearchOrderParam>> SearchOrder(int page, int ProviderId, int Status, string Code, string FromDate, string ToDate)
        {
            try
            {
                return await _orderRepository.SearchOrder(page, ProviderId, Status, Code, FromDate, ToDate);
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
                return await _orderRepository.UpdateOrder(o, userId);
            }
            catch (Exception ex)
            {
                return SystemParam.ERROR;
            }
        }
    }
}
