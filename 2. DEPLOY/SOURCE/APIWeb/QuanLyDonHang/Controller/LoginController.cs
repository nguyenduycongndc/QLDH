using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyDonHang.Common.Utils;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.Configs;
using QuanLyDonHang.Common.ViewModel.Login;
using QuanLyDonHang.GridMail;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuanLyDonHang.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMail _mail;
        //private readonly IForgotPassword _forgotPassword;
        public LoginController(IUserService userService, IMail mail)
        {
            _userService = userService;
            _mail = mail;
        }

        [HttpPost("LoginWeb")]
        public async Task<JsonResultModel> LoginWeb([FromBody] LoginViewModel userLogin)
        {
            try
            {
                var data = await _userService.CheckLogin(userLogin);
                if (data == null) return new JsonResultModel(0, 500, "Số điện thoại hoặc mật khẩu không đúng", null);
                HttpContext.Session.SetString("userId", data.ID.ToString());
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("ForgetPassword")]
        public async Task<JsonResultModel> ForgetPassword([FromForm] WelcomeRequest request)
        {
            try
            {
                await _mail.SendWelcomeEmailAsync(request);

                return new JsonResultModel(1, 200, "Success", null); // 200
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, "Fail", null); // 400
            }
            
        }
    }
}
