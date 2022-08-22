using PagedList;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.Login;
using QuanLyDonHang.Common.ViewModel.Users;
using QuanLyDonHang.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Repository.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        public Task<int> CheckUser(AddUserViewModel addUserViewModel);
        public Task<IPagedList<UserDetailViewModel>> SearchUser(int Page, string NameOrPhone, int Role, int IsActive);
        public Task UpdateUser(UpdateUserViewModel user, int userId);
        public Task ResetPassword(int Id);
        public Task<User> CheckLogin(string userLogin);
        public Task<User> CheckToken(string token);
        public Task<User> FindByEmailAsync(string Email);
    }
}
