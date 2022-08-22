using QuanLyDonHang.Common.ViewModel.File;
using QuanLyDonHang.Domain;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace QuanLyDonHang.Repository
{
    public class FileReponsitory : BaseRepository<UpFile>, IFileReponsitory
    {
        public FileReponsitory(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
        public async Task<List<FileModel>> DetailFile(int Id)
        {
            try
            {
                var query = await (from fi in DbContext.Files
                                   where fi.FolderId.Equals(Id)
                                   select new FileModel
                                   {
                                       ID = fi.ID,
                                       Name = fi.Name,
                                       Path = fi.Path,
                                       IsActive = fi.IsActive,
                                       FolderId = fi.FolderId
                                       
                                   }).ToListAsync();
                return query;
            }
            catch
            {
                return new List<FileModel>();
            }
        }
        //them du lieu file vao db
        public async Task AddNew(Upfile fileModel)
        {
            try
            {
                UpFile o = new UpFile()
                {
                    Name = fileModel.Name,
                    Path = fileModel.Path,
                    FolderId = fileModel.FolderId,
                    CreatedDate = DateTime.Now,
                    IsActive = 1
                };

                DbContext.Add(o);
                await DbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
