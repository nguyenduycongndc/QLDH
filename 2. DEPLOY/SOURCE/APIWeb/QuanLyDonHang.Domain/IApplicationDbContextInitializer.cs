using System.Threading.Tasks;

namespace QuanLyDonHang.Domain
{
    public interface IApplicationDbContextInitializer
    {
        bool EnsureCreated();
        void Migrate();
        Task Seed();
    }
}