using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.Configs;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuanLyDonHang.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigController : ControllerBase
    {
        private readonly IConfigService _configService;
        private readonly IUserService _userService;
        public ConfigController(IConfigService configService, IUserService userService)
        {
            _configService = configService;
            _userService = userService;
        }
        [HttpGet("Detail")]
        public async Task<JsonResultModel> GetConfig()
        {
            var data = await _configService.GetByIdAsync(1);
            return new JsonResultModel(1, 200, "Success", data);
        }
        [HttpPost("Update")]
        public async Task<JsonResultModel> UpdateConfig([FromBody] DetailConfigViewModel config)
        {
            var token = HttpContext.Request.Headers["token"].ToString();
            var user = await _userService.CheckToken(token);
            var userId = (user != null) ? user.ID : -1;
            if (userId == -1)
            {
                return new JsonResultModel(0, 403, "Not Found", null);
            }
            await _configService.UpdateConfig(config.Code);
            return new JsonResultModel(1, 200, "Success", null);
        }
    }
}
