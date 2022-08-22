using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.Configs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuanLyDonHang.GridMail
{
    public interface IMail
    {
        Task SendEmailAsync(MailRequest mailRequest);
        Task SendWelcomeEmailAsync(WelcomeRequest request);
    }
}
