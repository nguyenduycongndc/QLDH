//using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.OrderDocument;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuanLyDonHang.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDocumentController : ControllerBase
    {
        private readonly IOrderDocumentService _orderDocumentService;
        private readonly IUserService _userService;
        public OrderDocumentController(IOrderDocumentService orderDocumentService, IUserService userService)
        {
            _orderDocumentService = orderDocumentService;
            _userService = userService;
        }

        [HttpPost("Upload")]
        //[Authorize]
        public async Task<JsonResultModel> Upload([FromForm] OrderDocumentModel orderDocumentModel)
        {
            try
            {
                var token = HttpContext.Request.Headers["token"].ToString();
                var user = await _userService.CheckToken(token);
                var userId = (user != null) ? user.ID : -1;
                if (orderDocumentModel == null || userId == -1)
                {
                    return new JsonResultModel(0, 403, "Please choose file/Please login", null);
                }
                var data = await _orderDocumentService.AddFileOrder(orderDocumentModel);
                if(data.SizeFile > 2097152){
                    return new JsonResultModel(0, 429, "Too Many Requests", null);
                }
                return new JsonResultModel(1, 200, "Success", data);
                //return true;
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
                //throw;
            }
        }
        //public async Task<bool> Upload([FromForm] OrderDocumentModel orderDocumentModel)
        //{
        //    try
        //    {
        //        await _orderDocumentService.AddFileOrder(orderDocumentModel);

        //        return true;
        //    }
        //    catch (Exception ex)
        //    {

        //        throw;
        //    }
        //}

        [HttpPost("DeleteFile")]
        //[Authorize]
        //public async Task<bool> DeleteFile(string fileName)
        //{
        //    try
        //    {
        //        await _orderDocumentService.DeleteFileOrder(fileName);

        //        return true;
        //    }
        //    catch (Exception ex)
        //    {

        //        throw;
        //    }
        //}
        public async Task<JsonResultModel> DeleteFile([FromForm] int Id, [FromForm] string fileName)
        {
            try
            {
                var token = HttpContext.Request.Headers["token"].ToString();
                var user = await _userService.CheckToken(token);
                var userId = (user != null) ? user.ID : -1;
                if (fileName == null || userId == -1)
                {
                    return new JsonResultModel(0, 403, "Please login", null);
                }
                var res = await _orderDocumentService.GetByIdAsync(Id);
                res.IsActive = 0;
                await _orderDocumentService.UpdateAsync(res);
                await _orderDocumentService.DeleteFileOrder(fileName);
                return new JsonResultModel(1, 200, "Success", null);
                //return true;
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
                //throw;
            }
        }
    }
}
