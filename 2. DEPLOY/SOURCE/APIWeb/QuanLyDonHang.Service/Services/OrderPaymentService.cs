using AutoMapper;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Service.Services
{
    public class OrderPaymentService : EcommerceServices<OrderPayment>, IOrderPaymentService
    {
        private readonly IOrderPaymentRepository _orderPaymentRepository;
        private readonly IMapper _mapper;
        public OrderPaymentService(IOrderPaymentRepository orderPaymentRepository, IMapper mapper) : base(orderPaymentRepository)
        {
            _orderPaymentRepository = orderPaymentRepository;
            _mapper = mapper;
        }
    }
}
