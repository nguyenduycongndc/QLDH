using AutoMapper;
using PagedList;
using QuanLyDonHang.Common.Utils;
using QuanLyDonHang.Common.ViewModel.Providers;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Services
{
    public class ProviderService : EcommerceServices<Provider>, IProviderService
    {
        private readonly IProviderRepository _providerRepository;
        private readonly IMapper _mapper;
        public ProviderService(IProviderRepository providerRepository, IMapper mapper) : base(providerRepository)
        {
            _providerRepository = providerRepository;
            _mapper = mapper;
        }

        public async Task<int> AddProvider(AddProviderViewModel input, int userId)
        {
            try
            {
                Provider p = new Provider()
                {
                    Code = input.Code,
                    Name = input.Name,
                    Tax = input.Tax,
                    PhoneNumber = input.PhoneNumber,
                    Email = input.Email,
                    Contact = input.Contact,
                    ContactPhoneNumber = input.ContactPhoneNumber,
                    Address = input.Address,
                    OfficeAddress = input.OfficeAddress,
                    Fax = input.Fax,
                    RegistrationDate = Util.ConvertDate(input.RegistrationDate),
                    ProductType = input.ProductType,
                    Representative = input.Representative,
                    CertificateProduct = input.CertificateProduct,
                    CreatedByID = userId,
                    CreatedDate = DateTime.Now,
                    ContructionType = input.ContructionType,
                    ModifiedByID = userId,
                    ModifiedDate = DateTime.Now,
                    IsActive = 1,
                    SubName = input.SubName,
                    Web = input.Web,
                    CharterCapital = input.CharterCapital,
                    MoneyTypeCharterCapital = input.MoneyTypeCharterCapital,
                    Revenue = input.Revenue,
                    MoneyTypeRevenue = input.MoneyTypeRevenue,
                    BankName = input.BankName,
                    AccountNumber = input.AccountNumber,
                    Type = input.Type,
                    Note = input.Note,
                    CapitalCurrency = input.CapitalCurrency,
                    RevenueCurrency = input.RevenueCurrency,
                    SwiftCode = input.SwiftCode,
                    EmailContactPerson = input.EmailContactPerson,
                    EngName = input.EngName,

                };
                await _providerRepository.AddAsync(p);
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
            
        }

        public async Task<IPagedList<SearchProviderViewModel>> SearchProvider(int Page, string str)
        {
            try
            {
                var data = await _providerRepository.SearchProvider(Page,str);
                return data;
            }
            catch(Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

        public async Task<int> UpdateProvider(UpdateProviderViewModel input, int userId)
        {
            try
            {
                await _providerRepository.UpdateProvider(input,userId);
                return SystemParam.SUCCESS;
            }
            catch(Exception ex)
            {
                return SystemParam.ERROR;
            }
        }
    }
}
