using Microsoft.AspNetCore.Mvc;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.Folder;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuanLyDonHang.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class FolderController : ControllerBase
    {
        private readonly IFolderService _folderService;
        private readonly IUserService _userService;
        public FolderController(IFolderService folderService, IUserService userService)
        {
            _folderService = folderService;
            _userService = userService;
        }
        [HttpGet("ListFolder")]
        public async Task<JsonResultModel> ListFolder(int Id)
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
                var data = await _folderService.ListFolder(Id);
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, "Fail", null);
            }
        }
        [HttpGet("DetailFolder")]
        public async Task<JsonResultModel> DetailFolder(int Id)
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
                var data = await _folderService.DetailFolder(Id);
                return new JsonResultModel(1, 200, "Success", data);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, "Fail", null);
            }
        }
        [HttpPost("CreateFolder")]
        public async Task<JsonResultModel> CreateFolder([FromBody] AddFolderModel addFolder)
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
                var model = await _folderService.FindAllAsync(x => x.Name.Equals(addFolder.FolderName) && x.IsActive.Equals(1) && x.ParentId.Equals(addFolder.ParentId));
                if (model.Count() > 0) return new JsonResultModel(0, 400, "Tên thư mục này đã tồn tại", null);
                
                var data = await _folderService.CreateFolder(addFolder, userId);
                return new JsonResultModel(1, 200, "Success", null);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("DeleteFolder")]
        public async Task<JsonResultModel> DeleteFolder([FromForm] int Id)
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
                var data = await _folderService.GetByIdAsync(Id);
                var res = await _folderService.GetByIdAsync(Id);
                res.IsActive = 0;
                await _folderService.UpdateAsync(res);
                return new JsonResultModel(1, 200, "Success", null);
            }
            catch (Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
        [HttpPost("UpdateFolder")]
        public async Task<JsonResultModel> UpdateFolder([FromBody] UpdateFolderModel updateFolderModel)
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
                var model = await _folderService.FindAllAsync(x => x.Name.Equals(updateFolderModel.UpdateFolderName) && x.IsActive.Equals(1) && x.ParentId.Equals(updateFolderModel.UpdateParentId));
                if (model.Count() > 0) return new JsonResultModel(0, 400, "Tên thư mục này đã tồn tại", null);
                var res = await _folderService.UpdateFolder(updateFolderModel, userId);
                return new JsonResultModel(1, 200, "Success", null);
            }
            catch(Exception ex)
            {
                return new JsonResultModel(0, 500, ex.ToString(), null);
            }
        }
    }
}
