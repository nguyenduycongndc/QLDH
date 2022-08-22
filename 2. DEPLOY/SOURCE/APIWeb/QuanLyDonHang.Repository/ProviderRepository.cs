using QuanLyDonHang.Common.ViewModel.Providers;
using QuanLyDonHang.Domain;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PagedList;
using QuanLyDonHang.Common.Utils;

namespace QuanLyDonHang.Repository
{
    public class ProviderRepository : BaseRepository<Provider>, IProviderRepository
    {
        public ProviderRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IPagedList<SearchProviderViewModel>> SearchProvider(int Page, string str)
        {
            try
            {
                var data = await (from p in DbContext.Providers
                                  where p.IsActive.Equals(1) && (!String.IsNullOrEmpty(str) ? (p.Name.Contains(str) || p.Code.Contains(str) || p.PhoneNumber.Contains(str)) : true)
                                  orderby p.CreatedDate descending
                                  select new SearchProviderViewModel
                                  {
                                      ID = p.ID,
                                      IsActive = p.IsActive,
                                      CreatedDate = p.CreatedDate,
                                      Code = p.Code,
                                      Name = p.Name,
                                      PhoneNumber = p.PhoneNumber,
                                      Email = p.Email,
                                      Representative = p.Representative,
                                      Tax = p.Tax,
                                      OfficeAddress = p.OfficeAddress,
                                      Address = p.Address,
                                      CertificateProduct = p.CertificateProduct,
                                      CreatedByID = p.CreatedByID,
                                      Fax = p.Fax,
                                      Contact = p.Contact,
                                      ContactPhoneNumber = p.ContactPhoneNumber,
                                      RegistrationDate = p.RegistrationDate,
                                      ProductType = p.ProductType,
                                      ContructionType = p.ContructionType,
                                      CreatedBy = DbContext.Users.Where(u => u.IsActive.Equals(1) && u.ID.Equals(p.CreatedByID)).Select(u => u.Username).FirstOrDefault(),
                                      ModifiedBy = p.ModifiedByID.HasValue ? DbContext.Users.Where(u => u.IsActive.Equals(1) && u.ID.Equals(p.ModifiedByID.Value)).Select(u => u.Username).FirstOrDefault() : "",
                                      ModifiedDate = p.ModifiedDate,
                                      SubName = p.SubName,
                                      Web = p.Web,
                                      CharterCapital = p.CharterCapital,
                                      MoneyTypeCharterCapital = p.MoneyTypeCharterCapital,
                                      Revenue = p.Revenue,
                                      MoneyTypeRevenue = p.MoneyTypeRevenue,
                                      BankName = p.BankName,
                                      AccountNumber = p.AccountNumber,
                                      Type = p.Type,
                                      Note = p.Note,
                                      CapitalCurrency = p.CapitalCurrency,
                                      RevenueCurrency = p.RevenueCurrency,
                                      SwiftCode = p.SwiftCode,
                                      EmailContactPerson = p.EmailContactPerson,
                                      EngName = p.EngName,
                                  }).ToListAsync();
                return data.ToPagedList(Page, 20);

            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task UpdateProvider(UpdateProviderViewModel p, int userId)
        {
            try
            {
                var pro = await DbContext.Providers.FindAsync(p.ID);
                pro.Code = p.Code;
                pro.Name = p.Name;
                pro.Tax = p.Tax;
                pro.PhoneNumber = p.PhoneNumber;
                pro.Email = p.Email;
                pro.Contact = p.Contact;
                pro.ContactPhoneNumber = p.ContactPhoneNumber;
                pro.Address = p.Address;
                pro.OfficeAddress = p.OfficeAddress;
                pro.Fax = p.Fax;
                pro.RegistrationDate = Util.ConvertDate(p.RegistrationDate);
                pro.ProductType = p.ProductType;
                pro.Representative = p.Representative;
                pro.CertificateProduct = p.CertificateProduct;
                pro.ContructionType = p.ContructionType;
                pro.ModifiedByID = userId;
                pro.ModifiedDate = DateTime.Now;
                pro.SubName = p.SubName;
                pro.Web = p.Web;
                pro.CharterCapital = p.CharterCapital;
                pro.MoneyTypeCharterCapital = p.MoneyTypeCharterCapital;
                pro.Revenue = p.Revenue;
                pro.MoneyTypeRevenue = p.MoneyTypeRevenue;
                pro.BankName = p.BankName;
                pro.AccountNumber = p.AccountNumber;
                pro.Type = p.Type;
                pro.Note = p.Note;
                pro.CapitalCurrency = p.CapitalCurrency;
                pro.RevenueCurrency = p.RevenueCurrency;
                pro.SwiftCode = p.SwiftCode;
                pro.EmailContactPerson = p.EmailContactPerson;
                pro.EngName = p.EngName;
                await DbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                ex.ToString();
            }
        }
    }
}
