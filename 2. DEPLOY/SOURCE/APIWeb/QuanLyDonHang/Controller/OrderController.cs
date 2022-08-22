using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using QuanLyDonHang.Common.Utils;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.Login;
using QuanLyDonHang.Common.ViewModel.Orders;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace QuanLyDonHang.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IUserService _userService;
        private readonly IProviderService _providerService;
        private readonly IMoneyService _moneyService;
        public OrderController(IMoneyService moneyService, IProviderService providerService, IOrderService orderService, IMapper mapper, IHostingEnvironment hostingEnvironment, IUserService userService)
        {
            _orderService = orderService;
            _mapper = mapper;
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _providerService = providerService;
            _moneyService = moneyService;
        }
        [HttpGet("GetProvider")]
        public async Task<JsonResultModel> GetProvider()
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
                var data = await _providerService.FindAllAsync(x => x.IsActive.Equals(1));
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, "Fail", null);
            }
        }
        [HttpGet("testExcel")]
        public async Task<FileResult> testExport(string listId)
        {
            string rootFolder = _hostingEnvironment.WebRootPath;
            string fileName = @"export.xlsx";
            FileInfo file = new FileInfo(Path.Combine(rootFolder, fileName));
            var list = await _orderService.ExportOrder(listId);
            using (ExcelPackage package = new ExcelPackage(file))
            {
                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.Commercial;
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                int row = 3;
                
                for (int i = 0 ; i < list.Count(); i++)
                {
                    worksheet.Cells[row, 1].Value = list[i].STT;
                    worksheet.Cells[row, 2].Value = list[i].Code;
                    worksheet.Cells[row, 3].Value = list[i].CreatedDate;
                    worksheet.Cells[row, 4].Value = list[i].ProviderName;
                    worksheet.Cells[row, 5].Value = list[i].ContructionName;
                    worksheet.Cells[row, 6].Value = list[i].Content;
                    worksheet.Cells[row, 7].Value = list[i].ContactCode;
                    worksheet.Cells[row, 8].Value = list[i].DeadlineDate;
                    row++;
                }

                package.Save();
                return File(package.GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            }
        }
        [HttpGet("ExportExel")]
        public async Task<FileResult> Export(string listId)
        {
            // lấy dữ liệu của các bản ghi cho vào 1 danh sách
            //string[] s = listId.Split(',');
            var list = await _orderService.ExportOrder(listId);
            var stream = new MemoryStream();
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.Commercial;
            using (var package = new ExcelPackage(stream))
            {

                var workSheet = package.Workbook.Worksheets.Add("Sheet1");
                workSheet.Cells.LoadFromCollection(list, true);
                package.Save();
                
            }
            stream.Position = 0;
            string excelName = $"OrderList-{DateTime.Now.ToString("yyyyMMddHHmmssfff")}.xlsx";
            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);

        }
        [HttpPost("Update")]
        public async Task<JsonResultModel> UpdateOrder([FromBody] UpdateOrderViewModel o)
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
                var res = await _orderService.UpdateOrder(o,userId);
                if (res == 1) return new JsonResultModel(1, 200, "Success", o);
                return new JsonResultModel(0, 500, "Fail", null);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("Create")]
        public async Task<JsonResultModel> CreateOrder([FromBody] AddOrderViewModel order)
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
                var res = await _orderService.CreateOrder(order, userId);
                var dt = await _orderService.GetAllAsync();
                var i = dt.Count - 1;
                var data = await _orderService.GetOrderDetail(dt[i].ID);
                if (res == 0) return new JsonResultModel(0, 400, "Failed", null);
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpGet("Search")]
        public async Task<JsonResultModel> SearchOrder(int page, int ProviderId, int Status, string Code, string FromDate, string ToDate)
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
                var model = await _orderService.SearchOrder(page, ProviderId, Status, Code, FromDate, ToDate);
                PageListOrder data = new PageListOrder();
                data.PageNumber = page;
                var s = await _orderService.FindAllAsync(x => x.IsActive.Equals(1));
                data.TotalItem = s.Count();
                data.TotalPage = s.Count() % 20 == 0 ? s.Count() / 20 : s.Count() / 20 + 1;
                data.list = model;
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, "Fail", null);
            }
        }
        //[HttpPost("Create")]
        //public async Task<JsonResultModel> CreateOrder([FromBody] )
        [HttpGet("Detail")]
        public async Task<JsonResultModel> DetailOrder(int Id)
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
                var data = await _orderService.GetOrderDetail(Id);
                //var data = await _orderService.GetByIdAsync(Id);
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, "Fail", null);
            }
        }
        [HttpPost("Delete")]
        public async Task<JsonResultModel> DeleteOrder([FromForm] string listId)
        {
            try
            {
                var token = HttpContext.Request.Headers["token"].ToString();
                var user = await _userService.CheckToken(token);
                if(user.checkRole == 0)
                {
                    return new JsonResultModel(0, 400, "Tài khoản này không có quyền xóa đơn hàng", null);
                }
                var userId = (user != null) ? user.ID : -1;
                if (userId == -1)
                {
                    return new JsonResultModel(0, 403, "Not Found", null);
                }
                
                string[] list = listId.Split(',');
                for (int i = 0; i < list.Length ; i++)
                {
                    var data = await _orderService.GetByIdAsync(Int32.Parse(list[i]));
                    data.IsActive = 0;
                    await _orderService.UpdateAsync(data);
                }
                return new JsonResultModel(1, 200, "Success", null);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpGet("getMoney")]
        public async Task<JsonResultModel> GetMoney()
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
                var data = await _moneyService.GetAllAsync();

                return new JsonResultModel(1, 200, "Thành công", data);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
    }
}
