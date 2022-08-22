using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using QuanLyDonHang.Common.ViewModel.File;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Services
{
    public class FileService : EcommerceServices<UpFile>, IFileService
    {
        private readonly IFileReponsitory _fileReponsitory;
        private readonly IMapper _mapper;
        public readonly string _contentFolder;
        public const string CONTEN_FOLDER_NAME = "UploadFile";
        public FileService(IFileReponsitory fileReponsitory, IMapper mapper, IWebHostEnvironment webHostEnvironment) : base(fileReponsitory)
        {
            _fileReponsitory = fileReponsitory;
            _mapper = mapper;
            _contentFolder = Path.Combine(webHostEnvironment.WebRootPath, CONTEN_FOLDER_NAME);
        }
        public async Task<List<FileModel>> DetailFile(int Id)
        {
            try
            {
                var data = await _fileReponsitory.DetailFile(Id);
                return data;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public string GetFileUrl(string fileName)
        {
            return $"/{CONTEN_FOLDER_NAME}/{fileName}";
        }

        public async Task SaveFileAsync(Stream mediaBinaryStrem, string fileName)
        {
            var filePath = Path.Combine(_contentFolder, fileName);// lay link
            using var output = new FileStream(filePath, FileMode.Create);// laay thu muc luu file
            await mediaBinaryStrem.CopyToAsync(output);//day file vao thu muc
        }

        public async Task DeleteFileAync(string fileName)
        {
            try
            {
                var filePath = Path.Combine(_contentFolder, fileName);

                if (File.Exists(filePath))
                {
                    await Task.Run(() => File.Delete(filePath));
                }
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public async Task<SaveFiModel> SaveFile(IFormFile file)
        {
            var originalFileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var sizeFile = file.Length;
            await SaveFileAsync(file.OpenReadStream(), originalFileName);
            return new SaveFiModel()
            {
                OriginalFileName = originalFileName,
                FileName = $"/{CONTEN_FOLDER_NAME}/{originalFileName}",
                SizeFile = sizeFile
            };
        }
        //tao funtion them file
        public async Task<SaveFiModel> AddFileOrder(Upfile fileModel)//lay model
        {
            var detailFile = await SaveFile(fileModel.File);

            if (fileModel.File != null)
            {
                fileModel.Path = detailFile.FileName;
                fileModel.Name = detailFile.OriginalFileName;
            }

            await _fileReponsitory.AddNew(fileModel);

            return new SaveFiModel()
            {
                OriginalFileName = detailFile.OriginalFileName,
                FileName = detailFile.FileName,
                SizeFile = detailFile.SizeFile
            };
        }

        public async Task<bool> DeleteFileOrder(string fileName)
        {
            await DeleteFileAync(fileName);

            return true;
        }
    }
}
