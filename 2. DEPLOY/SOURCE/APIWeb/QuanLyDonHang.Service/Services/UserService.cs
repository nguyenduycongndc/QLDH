using AutoMapper;
using QuanLyDonHang.Service.Services;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using QuanLyDonHang.Common.Utils;
using QuanLyDonHang.Service.ViewModel;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.Users;
using QuanLyDonHang.Common.ViewModel.Login;
using PagedList;

namespace QuanLyDonHang.Service.Services
{
    public class UserService : EcommerceServices<User>, IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UserService(IUserRepository userRepository, IMapper mapper) : base(userRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<List<UserViewModel>> GetUserViewModels()
        {
            var model = await _userRepository.GetAllAsync();
            return _mapper.Map<List<UserViewModel>>(model);

        }

        public async Task<bool> AddUserViewModels(AddUserViewModel addUserViewModel, int userId)
        {
            int check = await _userRepository.CheckUser(addUserViewModel);
            if (check == 0)
            {
                var user = new User
                {
                    Username = addUserViewModel.UserName,
                    PhoneNumber = addUserViewModel.PhoneNumber,
                    Email = addUserViewModel.Email,
                    Password = Util.GenPass(addUserViewModel.Password),
                    CreatedBy = userId,
                    CreatedDate = DateTime.Now,
                    Role = 1,
                    IsActive = 1,
                    ModifiedBy = userId,
                    ModifiedDate = DateTime.Now,
                    checkRole = addUserViewModel.checkRole,
                };
                await _userRepository.AddAsync(user);
                return true;
            }
            else return false;
        }

        public async Task<IPagedList<UserDetailViewModel>> SearchUser(int Page, string NameOrPhone, int Role, int IsActive)
        {
            var listUser = await _userRepository.SearchUser( Page, NameOrPhone, Role, IsActive);
            return listUser;
        }

        public async Task UpdateUser(UpdateUserViewModel user, int userId)
        {
            await _userRepository.UpdateUser(user, userId);
        }

        public async Task ResetPassword(int Id)
        {
            await _userRepository.ResetPassword(Id);
        }

        public async Task<User> CheckLogin(LoginViewModel userLogin)
        {
            try
            {
                var model = await _userRepository.CheckLogin(userLogin.PhoneNumber);
                if (Util.CheckPass(userLogin.Password,model.Password) == false) return null;
                model.Token = Util.CreateMD5(DateTime.Now.ToString());
                await _userRepository.UpdateAsync(model);
                return model;
            }
            catch(Exception ex)
            {
                return null;
            }
            
        }

        public async Task<User> CheckToken(string Token)
        {
            var user = await _userRepository.CheckToken(Token);
            return user;
        }

        public async Task<UserDetailViewModel> ForgotPassword(string Email)
        {
            var user = await _userRepository.FindByEmailAsync(Email);
            if (user == null) return null;
            var model = _mapper.Map<UserDetailViewModel>(user);
            return model;
        }
    }
}
