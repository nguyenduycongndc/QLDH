using QuanLyDonHang.Service.Interface;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Service.ViewModel;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using QuanLyDonHang.Common.ViewModel.Users;
using QuanLyDonHang.Common.ViewModel.Login;
using PagedList;

namespace QuanLyDonHang.Service.Interfaces
{
    public interface IUserService : IServices<User>
    {
        public Task<List<UserViewModel>> GetUserViewModels();
        public Task<bool> AddUserViewModels(AddUserViewModel addUserViewModel, int userId);
        public Task<IPagedList<UserDetailViewModel>> SearchUser(int Page, string NameOrPhone, int Role, int IsActive);
        public Task UpdateUser(UpdateUserViewModel user, int userId);
        public Task ResetPassword(int Id);
        public Task<User> CheckLogin(LoginViewModel userLogin);
        public Task<User> CheckToken(string Token);
        public Task<UserDetailViewModel> ForgotPassword(string Email);
    }
}
