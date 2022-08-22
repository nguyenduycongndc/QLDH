
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using QuanLyDonHang.Domain.Models;

namespace QuanLyDonHang.Domain
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {           
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Money> Money { get; set; }
        public DbSet<OrderDocument> OrderDocuments { get; set; }
        public DbSet<OrderPayment> OrderPayments { get; set; }
        public DbSet<Config> Configs { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<Folder> Folders { get; set; }
        public DbSet<UpFile> Files { get; set; }
        public DbSet<WarehouseReceipt> warehouseReceipts { get; set; }
    }
}