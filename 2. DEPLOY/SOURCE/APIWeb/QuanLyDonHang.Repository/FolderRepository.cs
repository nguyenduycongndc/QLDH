using PagedList;
using QuanLyDonHang.Common.ViewModel.Folder;
using QuanLyDonHang.Domain;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using QuanLyDonHang.Common.ViewModel.File;

namespace QuanLyDonHang.Repository
{
    public class FolderRepository : BaseRepository<Folder>, IFolderReponsitory
    {
        public FolderRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
        //Lấy danh sách cha
        public async Task<FoldersModel> List(int Id)
        {
            try
            {
                var listFolders = await (from fo in DbContext.Folders
                                         where fo.ParentId.Equals(Id) && fo.IsActive.Equals(1)
                                         orderby fo.CreatedDate descending
                                         select new ListFolderModel
                                         {
                                             ID = fo.ID,
                                             Name = fo.Name,
                                             IsActive = fo.IsActive,
                                             ParentId = fo.ParentId,
                                             CreatedDate = fo.CreatedDate,
                                             //fileDetails = DbContext.Files.Where(x => x.FolderId.Equals(fo.ID)).Select(x => new FileDetail
                                             //{
                                             //    ID = x.ID,
                                             //    Name = x.Name,
                                             //    Path = x.Path,
                                             //    IsActive = x.IsActive,
                                             //    FolderId = x.FolderId,
                                             //}).ToList(),
                                         }).ToListAsync();
                var listFile = await (from fo in DbContext.Files
                                      where fo.FolderId.Equals(Id) && fo.IsActive.Equals(1)
                                      orderby fo.CreatedDate descending
                                      select new FileModel
                                      {
                                          ID = fo.ID,
                                          Name = fo.Name,
                                          IsActive = fo.IsActive,
                                          Path = fo.Path,
                                          FolderId = fo.FolderId,
                                          CreatedDate = fo.CreatedDate,
                                      }).ToListAsync();
                var respomse = new FoldersModel
                {
                    listFiles = listFile,
                    listFolders = listFolders
                };
                return respomse;

            }
            catch
            {
                return null;
            }
        }
        //public async Task<List<ListFolderModel>> List()
        //{
        //    try
        //    {
        //        var lists = await (from fo in DbContext.Folders
        //                           where fo.ParentId.Equals(-1)
        //                           select new ListFolderModel
        //                           {
        //                               ID = fo.ID,
        //                               Name = fo.Name,
        //                               IsActive = fo.IsActive,
        //                               ParentId = fo.ParentId,
        //                           }).ToListAsync();

        //        return lists;
        //    }
        //    catch
        //    {
        //        return new List<ListFolderModel>();
        //    }
        //}
        //detail con
        public async Task<ListFolderModel> DetailFolder(int Id)
        {
            try
            {
                var query = await (from fo in DbContext.Folders
                                   where fo.ID.Equals(Id)
                                   select new ListFolderModel
                                   {
                                       ID = fo.ID,
                                       Name = fo.Name,
                                       ParentId = fo.ParentId,
                                       IsActive = fo.IsActive,
                                       folderDetails = DbContext.Folders.Where(x => x.ParentId.Equals(fo.ID)).Select(x => new FolderDetail
                                       {
                                           ID = x.ID,
                                           Name = x.Name,
                                           ParentId = x.ParentId,
                                           IsActive = x.IsActive,
                                       }).ToList(),
                                       fileDetails = DbContext.Files.Where(x => x.FolderId.Equals(fo.ID)).Select(x => new FileDetail
                                       {
                                           ID = x.ID,
                                           Name = x.Name,
                                           Path = x.Path,
                                           IsActive = x.IsActive,
                                           FolderId = x.FolderId,
                                       }).ToList(),
                                   }).FirstOrDefaultAsync();
                return query;
            }
            catch
            {
                return new ListFolderModel();
            }
        }

        public async Task UpdateFolder(UpdateFolderModel input, int userId)
        {
            try
            {
                var folder = await DbContext.Folders.FindAsync(input.Id);
                folder.Name = input.UpdateFolderName;
                folder.ParentId = input.UpdateParentId;
                await DbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                ex.ToString();
            }
        }
    }
}
