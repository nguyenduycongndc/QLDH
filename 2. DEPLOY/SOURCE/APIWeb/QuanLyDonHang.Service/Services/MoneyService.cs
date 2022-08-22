using AutoMapper;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Services
{
    public class MoneyService : EcommerceServices<Money>, IMoneyService
    {
        private readonly IMoneyRepository _moneyRepository;
        private readonly IMapper _mapper;
        public MoneyService(IMoneyRepository moneyRepository, IMapper mapper) : base(moneyRepository)
        {
            _moneyRepository = moneyRepository;
            _mapper = mapper;
        }

        public async Task<List<MoneyViewModel>> GetMoneyViewModels()
        {
            var model = await _moneyRepository.FindAllAsync(x => x.IsActive == 1);
            return _mapper.Map<List<MoneyViewModel>>(model);
        }

    }
}
