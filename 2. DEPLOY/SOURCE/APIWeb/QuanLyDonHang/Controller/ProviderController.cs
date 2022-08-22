using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.Providers;
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
    public class ProviderController : ControllerBase
    {
        private readonly IProviderService _providerService;
        private readonly IOrderService _orderService;
        private readonly IUserService _userService;
        public ProviderController(IProviderService providerService, IOrderService orderService, IUserService userService)
        {
            _providerService = providerService;
            _orderService = orderService;
            _userService = userService;
        }
        [HttpGet("Search")]
        public async Task<JsonResultModel> SearchProvider(int Page, string str)
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
                var model = await _providerService.SearchProvider(Page, str);
                PageListProvider data = new PageListProvider();
                data.PageNumber = Page;
                var s = await _providerService.FindAllAsync(x => x.IsActive.Equals(1));
                data.TotalItem = s.Count();
                data.TotalPage = s.Count() % 20 == 0 ? s.Count() / 20 : s.Count() / 20 + 1;
                data.list = model;
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("Update")]
        public async Task<JsonResultModel> UpdateProvider([FromBody] UpdateProviderViewModel provider)
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
                //var code = await _providerService.FindAllAsync(x => x.Code.Equals(provider.Code) && x.IsActive.Equals(1));
                //if (code.Count() > 0) return new JsonResultModel(0, 400, "Mã nhà cung cấp đã tồn tại", null);
                var res = await _providerService.UpdateProvider(provider, userId);
                return new JsonResultModel(1, 200, "", provider);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("Create")]
        public async Task<JsonResultModel> CreateProvider([FromBody] AddProviderViewModel provider)
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
                var code = await _providerService.FindAllAsync(x => x.Code.Equals(provider.Code) && x.IsActive.Equals(1));
                if (code.Count() > 0) return new JsonResultModel(0, 400, "Mã nhà cung cấp đã tồn tại", null);
                var model = await _providerService.FindAllAsync(x => x.PhoneNumber.Equals(provider.PhoneNumber));
                if (model.Count() > 0) return new JsonResultModel(0, 400, "Số điện thoại bị trùng", null);
                var email = await _providerService.FindAllAsync(x => x.Email != "" && x.Email.Equals(provider.Email));
                if (email.Count() > 0) return new JsonResultModel(0, 400, "Email bị trùng", null);
                var res = await _providerService.AddProvider(provider, userId);
                var dt = await _providerService.GetAllAsync();
                var i = dt.Count - 1;
                var data = await ProviderDetail(dt[i].ID);
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpGet("Detail")]
        public async Task<JsonResultModel> ProviderDetail(int Id)
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
                var data = await _providerService.GetByIdAsync(Id);
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("Delete")]
        public async Task<JsonResultModel> DeleteProvider([FromForm] string listId)
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
                for(int i = 0; i < list.Length ; i++)
                {
                    var data = await _providerService.GetByIdAsync(Int32.Parse(list[i]));
                    var model = await _orderService.FindAllAsync(x => x.IsActive.Equals(1) && x.ProviderID.Equals(data.ID));
                    if (model.Count() > 0) return new JsonResultModel(0, 400, "Không thể xóa nhà cung cấp "+ data.Name + " đang tồn tại trong đơn hàng", null);
                    var res = await _providerService.GetByIdAsync(Int32.Parse(list[i]));
                    res.IsActive = 0;
                    await _providerService.UpdateAsync(res);
                }
                return new JsonResultModel(1, 200, "Success", null);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
    }
}
