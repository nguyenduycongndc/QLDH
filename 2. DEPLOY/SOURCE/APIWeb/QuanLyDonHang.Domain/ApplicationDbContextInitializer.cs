using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace QuanLyDonHang.Domain
{
    public class ApplicationDbContextInitializer : IApplicationDbContextInitializer
    {
        private readonly ApplicationDbContext _context;

        public ApplicationDbContextInitializer(ApplicationDbContext context)
        {
            _context = context;
        }

        public bool EnsureCreated()
        {
            return _context.Database.EnsureCreated();
        }

        public void Migrate()
        {
            _context.Database.Migrate();
        }

        public Task Seed()
        {
            throw new System.NotImplementedException();
        }
    }
}