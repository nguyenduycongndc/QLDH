using AutoMapper;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration.EnvironmentVariables;
using QuanLyDonHang.Common.ViewModel.OrderDocument;
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;

namespace QuanLyDonHang.Service.Services
{
    public class OrderDocumentService : EcommerceServices<OrderDocument>, IOrderDocumentService
    {
        private readonly IOrderDocumentRepository _orderDocumentRepository;
        private readonly IMapper _mapper;
        public readonly string _contentFolder;
        public const string CONTEN_FOLDER_NAME = "UploadFile";

        public OrderDocumentService(IOrderDocumentRepository orderDocumentRepository, IMapper mapper, IHostingEnvironment hostingEnvironment, IWebHostEnvironment webHostEnvironment) : base(orderDocumentRepository)
        {
            _orderDocumentRepository = orderDocumentRepository;
            _mapper = mapper;
            //_contentFolder = Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location), CONTEN_FOLDER_NAME);
            _contentFolder = Path.Combine(webHostEnvironment.WebRootPath, CONTEN_FOLDER_NAME);
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

        public async Task<SaveFileModel> SaveFile(IFormFile file)
        {
            var originalFileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            //var fileName = $"{Guid.NewGuid()}{Path.GetExtension(originalFileName)}";
            var sizeFile = file.Length;
            await SaveFileAsync(file.OpenReadStream(), originalFileName);
            //return new Tuple<string, string>($"/{CONTEN_FOLDER_NAME}/{originalFileName}", originalFileName);
            return new SaveFileModel() {
                OriginalFileName = originalFileName,
                //FileName = fileName,
                FileName = $"/{CONTEN_FOLDER_NAME}/{originalFileName}",
                SizeFile = sizeFile
            };

            //var originalFileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            //await SaveFileAsync(file.OpenReadStream(), originalFileName);
            //return originalFileName;
        }
        //tao funtion them file
        public async Task<SaveFileModel> AddFileOrder(OrderDocumentModel orderDocument)//lay model
        {
            var detailFile = await SaveFile(orderDocument.File);

            if (orderDocument.File != null)
            {
                orderDocument.Path = detailFile.FileName;
                orderDocument.Name = detailFile.OriginalFileName;
            }

            await _orderDocumentRepository.AddNew(orderDocument);

            return new SaveFileModel() {
                OriginalFileName = detailFile.OriginalFileName,
                FileName = detailFile.FileName,
                SizeFile = detailFile.SizeFile
            };
        }

        public async Task<bool> DeleteFileOrder(string fileName)
        {
            //var originalFileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            //var fileName = $"{Guid.NewGuid()}{Path.GetExtension(originalFileName)}";

            await DeleteFileAync(fileName);

            return true;
        }
    }
}
