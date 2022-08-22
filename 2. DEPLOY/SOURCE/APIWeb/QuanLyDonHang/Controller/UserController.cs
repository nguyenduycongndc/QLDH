using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyDonHang.Common.Utils;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.Users;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuanLyDonHang.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;
        private IMoneyService _moneyService;
        public UserController(IUserService userService, IMoneyService moneyService)
        {
            _userService = userService;
            _moneyService = moneyService;
        }
        //search user
        [HttpGet("Search")]
        public async Task<JsonResultModel> SearchUser(int Page, string NameOrPhone, int Role, int IsActive)
        {
            try
            {
                var token = HttpContext.Request.Headers["token"].ToString();
                var user = await _userService.CheckToken(token);
                var userId = (user != null) ? user.ID : -1;
                if (userId == -1)
                {
                    return new JsonResultModel(0, 403, "Not Found", null);
                }
                var model = await _userService.SearchUser(Page, NameOrPhone, Role, IsActive);
                PageListUser data = new PageListUser();
                data.PageNumber = Page;
                var s = await _userService.FindAllAsync(x => x.IsActive >= 1);
                data.TotalItem = s.Count();
                data.TotalPage = s.Count() % 20 == 0 ? s.Count() / 20 : s.Count() / 20 + 1;
                data.list = model;
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("Add")]
        public async Task<JsonResultModel> AddUser([FromBody] AddUserViewModel addUserViewModel)
        {
            try
            {
                var token = HttpContext.Request.Headers["token"].ToString();
                var user = await _userService.CheckToken(token);
                var userId = (user != null) ? user.ID : -1;
                if (userId == -1)
                {
                    return new JsonResultModel(0, 403, "Not Found", null);
                }
                var code = await _userService.AddUserViewModels(addUserViewModel, userId);
                var dt = await _userService.GetAllAsync();
                var i = dt.Count - 1;
                var data = await UserDetail(dt[i].ID);
                if (code == true) return new JsonResultModel(1, 200, "Success", data);
                return new JsonResultModel(0, 400, "Số điện thoại hoặc Email bị trùng", null);
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new JsonResultModel(1, 500, ex.ToString(), null);
            }
        }
        [HttpPost("Delete")]
        public async Task<JsonResultModel> DeleteUser([FromForm] string listId)
        {
            try
            {
                var token = HttpContext.Request.Headers["token"].ToString();
                var user = await _userService.CheckToken(token);
                var userId = (user != null) ? user.ID : -1;
                if (userId == -1)
                {
                    return new JsonResultModel(0, 403, "Not Found", null);
                }
                string[] list = listId.Split(',');
                for (int i = 0; i < list.Length; i++)
                {
                    var data = await _userService.GetByIdAsync(Int32.Parse(list[i]));
                    data.IsActive = 0;
                    await _userService.UpdateAsync(data);
                }
                return new JsonResultModel(1, 200, "Success", null);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpGet("Detail")]
        public async Task<JsonResultModel> UserDetail(int Id)
        {
            try
            {
                var token = HttpContext.Request.Headers["token"].ToString();
                var user = await _userService.CheckToken(token);
                var userId = (user != null) ? user.ID : -1;
                if (userId == -1)
                {
                    return new JsonResultModel(0, 403, "Not Found", null);
                }
                var model = await _userService.GetByIdAsync(Id);
                if (model == null) return new JsonResultModel(0, 500, "Fail", null);
                return new JsonResultModel(1, 200, "Success", model);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("Update")]
        public async Task<JsonResultModel> UpdateUser([FromBody] UpdateUserViewModel user)
        {
            try
            {

                var token = HttpContext.Request.Headers["token"].ToString();
                var userToken = await _userService.CheckToken(token);
                var userId = (userToken != null) ? userToken.ID : -1;
                if (userId == -1)
                {
                    return new JsonResultModel(0, 403, "Not Found", null);
                }
                var dt = await _userService.FindAllAsync(x => x.IsActive.Equals(1));
                var x = dt.ToArray();
                for (int i = 0; i < dt.Count(); i++)
                {
                    if (x[i].Token != userToken.Token)
                    {
                        x[i].Token = "";
                    }
                }
                var model = await _userService.FindAllAsync(x => (x.Email.Equals(user.Email) || x.PhoneNumber.Equals(user.PhoneNumber)) && x.ID != user.ID);
                if (model.Count() >= 1) return new JsonResultModel(0, 400, "Không thể cập nhật theo email hoặc số điện thoại này!", null);
                await _userService.UpdateUser(user, userId);
                return new JsonResultModel(1, 200, "Success", user);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("ResetPassword")]
        public async Task<JsonResultModel> ResetPassword([FromForm] int Id)
        {
            try
            {
                var token = HttpContext.Request.Headers["token"].ToString();
                var user = await _userService.CheckToken(token);
                var userId = (user != null) ? user.ID : -1;
                if (userId == -1)
                {
                    return new JsonResultModel(0, 403, "Not Found", null);
                }
                await _userService.ResetPassword(Id);
                return new JsonResultModel(1, 200, "Success", null);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("ChangePassword")]
        public async Task<JsonResultModel> ChangePassword([FromForm] int ID, [FromForm] string Password, [FromForm] string ConfirmPassword)
        {
            try
            {
                var token = HttpContext.Request.Headers["token"].ToString();
                var user = await _userService.CheckToken(token);
                var userId = (user != null) ? user.ID : -1;
                if (userId == -1)
                {
                    return new JsonResultModel(0, 403, "Not Found", null);
                }
                var model = await _userService.GetByIdAsync(ID);
                if (Util.CheckPass(Password, model.Password) == false) return new JsonResultModel(0, 400, "Mật khẩu cũ không đúng", null);
                model.Password = Util.GenPass(ConfirmPassword);
                await _userService.UpdateAsync(model);
                return new JsonResultModel(1, 200, "Success", model);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, "Failed", null);
            }
        }

    }
}
