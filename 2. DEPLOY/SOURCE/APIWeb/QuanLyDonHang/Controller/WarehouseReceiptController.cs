using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.Orders;
using QuanLyDonHang.Common.ViewModel.WarehouseReceipt;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace QuanLyDonHang.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehouseReceiptController : ControllerBase
    {
        private readonly IWarehouseReceiptService _warehouseReceiptService;
        private readonly IOrderService _orderService;
        private readonly IUserService _userService;
        public WarehouseReceiptController(IWarehouseReceiptService  warehouseReceiptService, IUserService userService, IOrderService orderService)
        {
            _warehouseReceiptService = warehouseReceiptService;
            _userService = userService;
            _orderService = orderService;
        }
        [HttpGet("GetOrder")]
        public async Task<JsonResultModel> GetOrder()
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
                var data = await _orderService.FindAllAsync(x => x.IsActive.Equals(1));
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, "Fail", null);
            }
        }
        [HttpPost("CreateWarehouseReceipt")]
        public async Task<JsonResultModel> CreateWarehouseReceipt([FromBody] AddWarehouseReceiptModel addWarehouseReceiptModel)
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
                var model = await _warehouseReceiptService.FindAllAsync(x => x.OrderId.Equals(addWarehouseReceiptModel.OrderId));
                if (model.Count() > 0) return new JsonResultModel(0, 400, "Mã đơn hàng này đã có phiếu nhập hàng", null);
                var res = await _warehouseReceiptService.CreateWarehouseReceipt(addWarehouseReceiptModel, userId);
                var dt = await _warehouseReceiptService.GetAllAsync();
                var i = dt.Count - 1;
                var data = await WarehouseReceiptDetail(dt[i].ID);
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("Delete")]
        public async Task<JsonResultModel> DeleteWarehouseReceipt([FromForm] string listId)
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
                    var data = await _warehouseReceiptService.GetByIdAsync(Int32.Parse(list[i]));
                    data.IsActive = 0;
                    await _warehouseReceiptService.UpdateAsync(data);
                }
                return new JsonResultModel(1, 200, "Success", null);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpGet("DetailProviderName")]
        public async Task<JsonResultModel> DetailProviderName(int Id)
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
                var data = await _warehouseReceiptService.DetailProviderName(Id);
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, "Fail", null);
            }
        }
        [HttpPost("UpdateWarehouseReceipt")]
        public async Task<JsonResultModel> UpdateWarehouseReceipt([FromBody] UpdateWarehouseReceiptModel updateWarehouseReceipt)
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
                var res = await _warehouseReceiptService.UpdateWarehouseReceipt(updateWarehouseReceipt, userId);
                return new JsonResultModel(1, 200, "Success", updateWarehouseReceipt);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpGet("Search")]
        public async Task<JsonResultModel> SearchWarehouseReceipt(int page, int ProviderId, string Code, string FromDate, string ToDate)
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
                var model = await _warehouseReceiptService.SearchWarehouseReceipt(page, ProviderId, Code, FromDate, ToDate);
                PageList data = new PageList();
                data.PageNumber = page;
                var s = await _orderService.FindAllAsync(x => x.IsActive.Equals(1));
                data.TotalItem = s.Count();
                data.TotalPage = s.Count() % 20 == 0 ? s.Count() / 20 : s.Count() / 20 + 1;
                data.list = model;
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, "Fail", null);
            }
        }
        [HttpGet("ExportExel")]
        public async Task<FileResult> ExportWarehouseReceipt(string listId)
        {
            // lấy dữ liệu của các bản ghi cho vào 1 danh sách
            //string[] s = listId.Split(',');
            var list = await _warehouseReceiptService.ExportWarehouseReceipt(listId);
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
        [HttpGet("Detail")]
        public async Task<JsonResultModel> WarehouseReceiptDetail(int Id)
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
                var data = await _warehouseReceiptService.GetByIdAsync(Id);
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
    }
}
