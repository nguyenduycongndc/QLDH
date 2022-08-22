using QuanLyDonHang.Domain;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.Utils;
using QuanLyDonHang.Common.ViewModel.Users;
using QuanLyDonHang.Common.ViewModel.Login;
using PagedList;

namespace QuanLyDonHang.Repository
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<User> CheckLogin(string PhoneNumber)
        {
            try
            {
                var user = await (from u in DbContext.Users where u.IsActive.Equals(1) && u.PhoneNumber.Equals(PhoneNumber) select u).FirstOrDefaultAsync();
                return user;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<User> CheckToken(string token)
        {
            var user = await (from u in DbContext.Users where u.IsActive.Equals(1) && u.Token == token select u).FirstOrDefaultAsync();
            return user;
        }

        public async Task<int> CheckUser(AddUserViewModel addUserViewModel)
        {
            try
            {
                var query = await (from u in DbContext.Users where u.IsActive.Equals(1) && (u.Email.Equals(addUserViewModel.Email) || u.PhoneNumber.Equals(addUserViewModel.PhoneNumber)) select u).ToListAsync();
                return query.Count();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<User> FindByEmailAsync(string Email)
        {
            try
            {
                var user = await (from u in DbContext.Users where u.IsActive.Equals(1) && u.Email.Equals(Email) select u).FirstOrDefaultAsync();
                return user;
            }
            catch(Exception ex)
            {
                return null;
            }
        }

        public async Task ResetPassword(int Id)
        {
            try
            {
                User u = DbContext.Users.Find(Id);
                u.Password = Util.GenPass(u.PhoneNumber);
                await DbContext.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IPagedList<UserDetailViewModel>> SearchUser(int Page, string NameOrPhone, int Role, int IsActive)
        {
            try
            {
                var query =  await (from u in DbContext.Users
                                   where (IsActive != -1 ? u.IsActive == IsActive : (u.IsActive >= 1))
                                     && (Role != -1 ? u.Role == Role : true)
                                     orderby u.CreatedDate descending
                                   select new UserDetailViewModel { 
                                       ID = u.ID,
                                       Status = u.IsActive,
                                       Username = u.Username,
                                       Email = u.Email,
                                       Phone = u.PhoneNumber,
                                       CreatedBy = DbContext.Users.Where(x => x.IsActive.Equals(1) && x.ID.Equals(u.CreatedBy)).Select(x=> x.Username).FirstOrDefault(),
                                       CreatedDate = u.CreatedDate,
                                       ModifiedBy = (u.ModifiedBy.HasValue? DbContext.Users.Where(x => x.IsActive.Equals(1) && x.ID.Equals(u.ModifiedBy.Value)).Select(x => x.Username).FirstOrDefault():null),
                                       ModifiedDate = u.ModifiedDate,
                                       checkRole = u.checkRole
                                   }).ToListAsync();
                if (NameOrPhone != null && NameOrPhone != "") query = query.Where(u => Util.Converts(u.Username.ToLower()).Contains(Util.Converts(NameOrPhone.ToLower())) || u.Username.Contains(NameOrPhone)).ToList();
                return query.ToPagedList(Page,20);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task UpdateUser(UpdateUserViewModel user, int userId)
        {
            try
            {
                User u = await DbContext.Users.FindAsync(user.ID);
                u.IsActive = user.IsActive;
                u.Username = user.Username;
                u.PhoneNumber = user.PhoneNumber;
                u.Email = user.Email;
                u.ModifiedBy = userId;
                u.ModifiedDate = DateTime.Now;
                u.checkRole = user.checkRole;
                await DbContext.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
