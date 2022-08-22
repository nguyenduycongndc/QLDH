using AutoMapper;
using PagedList;
using QuanLyDonHang.Common.Utils;
using QuanLyDonHang.Common.ViewModel.Folder;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Services
{
    public class FolderService : EcommerceServices<Folder>, IFolderService
    {
        private readonly IFolderReponsitory _folderReponsitory;
        private readonly IMapper _mapper;
        public FolderService(IFolderReponsitory folderReponsitory, IMapper mapper) : base(folderReponsitory)
        {
            _folderReponsitory = folderReponsitory;
            _mapper = mapper;
        }

        //public async Task<List<ListFolderModel>> ListFolder(int Id)
        public async Task<FoldersModel> ListFolder(int Id)
        {
            try
            {
                var data = await _folderReponsitory.List(Id);
                return data;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<ListFolderModel> DetailFolder(int Id)
        {
            try
            {
                var data = await _folderReponsitory.DetailFolder(Id);
                return data;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        //thêm mới folder
        public async Task<int> CreateFolder(AddFolderModel input, int userId)
        {
            try
            {
                Folder fo = new Folder()
                {
                    Name = input.FolderName,
                    ParentId = input.ParentId,
                    CreatedDate = DateTime.Now,
                    IsActive = 1,
                };
                await _folderReponsitory.AddAsync(fo);
                return SystemParam.SUCCESS;
            }
            catch
            {
                return SystemParam.ERROR;
            }
        }
        //sửa Folder
        public async Task<int> UpdateFolder(UpdateFolderModel input, int userId)
        {
            try
            {
                await _folderReponsitory.UpdateFolder(input, userId);
                return SystemParam.SUCCESS;
            }
            catch(Exception ex)
            {
                return SystemParam.ERROR;
            }
        }
    }
}
