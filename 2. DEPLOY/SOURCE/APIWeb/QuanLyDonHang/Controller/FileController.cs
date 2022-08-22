using Microsoft.AspNetCore.Mvc;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.File;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuanLyDonHang.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IUserService _userService;
        public FileController(IFileService fileService, IUserService userService)
        {
            _fileService = fileService;
            _userService = userService;
        }
        [HttpGet("DetailFile")]
        public async Task<JsonResultModel> DetailFile(int Id)
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
                var data = await _fileService.DetailFile(Id);
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, "Fail", null);
            }
        }
        [HttpPost("UploadFile")]
        //[Authorize]
        public async Task<JsonResultModel> Upload([FromForm] Upfile fileModel)
        {
            try
            {
                var token = HttpContext.Request.Headers["token"].ToString();
                var user = await _userService.CheckToken(token);
                var userId = (user != null) ? user.ID : -1;
                if (fileModel == null || userId == -1)
                {
                    return new JsonResultModel(0, 403, "Please choose file", null);
                }
                var model = await _fileService.FindAllAsync(
                    x => x.Name.Equals(fileModel.File.FileName)
                    && x.IsActive.Equals(1) && x.FolderId.Equals(fileModel.FolderId));
                if (model.Count() > 0) return new JsonResultModel(0, 400, "Tên file này đã tồn tại", null);
                var data = await _fileService.AddFileOrder(fileModel);
                if (data.SizeFile > 2097152)
                {
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
        //[HttpPost("DeleteFile")]
        //public async Task<JsonResultModel> DeleteFile([FromForm] int Id, [FromForm] string fileName)
        //{
        //    try
        //    {
        //        var token = HttpContext.Request.Headers["token"].ToString();
        //        var user = await _userService.CheckToken(token);
        //        var userId = (user != null) ? user.ID : -1;
        //        if (fileName == null || userId == -1)
        //        {
        //            return new JsonResultModel(0, 403, "Please login", null);
        //        }
        //        var res = await _fileService.GetByIdAsync(Id);
        //        res.IsActive = 0;
        //        await _fileService.DeleteFileOrder(fileName);
        //        await _fileService.UpdateAsync(res);
        //        return new JsonResultModel(1, 200, "Success", null);
        //        //return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        return new JsonResultModel(0, 500, ex.ToString(), null);
        //        //throw;
        //    }
        //}
        [HttpPost("DeleteFile")]
        public async Task<JsonResultModel> DeleteFile([FromForm] int Id)
        {
            try
            {
                var token = HttpContext.Request.Headers["token"].ToString();
                var user = await _userService.CheckToken(token);
                var userId = (user != null) ? user.ID : -1;
                if (userId == -1)
                {
                    return new JsonResultModel(0, 403, "Please login", null);
                }
                var res = await _fileService.GetByIdAsync(Id);
                res.IsActive = 0;
                await _fileService.UpdateAsync(res);
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
