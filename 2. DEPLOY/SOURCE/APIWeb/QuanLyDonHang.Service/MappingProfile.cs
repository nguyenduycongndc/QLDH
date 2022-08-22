using AutoMapper;
using QuanLyDonHang.Common.ViewModel;
using QuanLyDonHang.Common.ViewModel.Users;
using QuanLyDonHang.Domain.Models;
using QuanLyDonHang.Service.ViewModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Service
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            MappingEntityToViewModel();
            MappingDtoToEntity();
        }

        private void MappingEntityToViewModel()
        {
            // case get data
            CreateMap<User, UserViewModel>();
            CreateMap<Money, MoneyViewModel>();
        }

        private void MappingDtoToEntity()
        {
            // case insert or update
            CreateMap<UpdateUserViewModel, User>();
        }
    }
}
