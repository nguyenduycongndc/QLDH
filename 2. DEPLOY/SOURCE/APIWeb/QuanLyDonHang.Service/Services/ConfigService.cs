using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Repository.Interfaces;
using QuanLyDonHang.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Services
{
    public class ConfigService : EcommerceServices<Config>,IConfigService
    {
        private readonly IConfigRepository _configRepository;
        public ConfigService(IConfigRepository configRepository) : base(configRepository)
        {
            _configRepository = configRepository; 
        }

        public async Task UpdateConfig(string Code)
        {
            Config config = new Config();
            config.ID = 1;
            config.Code = Code;
            config.IsActive = 1;
            config.CreatedDate = DateTime.Now;
            await _configRepository.UpdateAsync(config);
        }
    }
}
