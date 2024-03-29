﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using QuanLyDonHang.Domain;

namespace QuanLyDonHang.Domain.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20210405041123_FoderUpdate")]
    partial class FoderUpdate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("QuanLyDonHang.Domain.Models.Config", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Code");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<int>("IsActive");

                    b.HasKey("ID");

                    b.ToTable("Configs");
                });

            modelBuilder.Entity("QuanLyDonHang.Domain.Models.Folder", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedDate");

                    b.Property<int>("IsActive");

                    b.Property<string>("Name");

                    b.Property<int>("ParentId");

                    b.HasKey("ID");

                    b.ToTable("Folders");
                });

            modelBuilder.Entity("QuanLyDonHang.Domain.Models.Money", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedDate");

                    b.Property<int>("IsActive");

                    b.Property<string>("Name");

                    b.HasKey("ID");

                    b.ToTable("Money");
                });

            modelBuilder.Entity("QuanLyDonHang.Domain.Models.Order", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AmountAfterTax");

                    b.Property<string>("AmountBeforeTax");

                    b.Property<string>("Code");

                    b.Property<string>("ContactCode");

                    b.Property<string>("ContactNumber");

                    b.Property<string>("ContructionName");

                    b.Property<string>("ContructionType");

                    b.Property<int>("CreatedByID");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime?>("DeadlineDate");

                    b.Property<string>("Description");

                    b.Property<int>("IsActive");

                    b.Property<int>("IsImport");

                    b.Property<int?>("ModifiedByID");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<int?>("MoneyID");

                    b.Property<int?>("MoneyTypeID");

                    b.Property<string>("ProductType");

                    b.Property<int>("ProviderID");

                    b.Property<int>("Rate");

                    b.Property<int>("Status");

                    b.Property<int?>("Warranty");

                    b.Property<DateTime?>("WarrantyPeriod");

                    b.Property<int?>("outOfDate");

                    b.HasKey("ID");

                    b.HasIndex("MoneyID");

                    b.HasIndex("ProviderID");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("QuanLyDonHang.Domain.Models.OrderDocument", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedDate");

                    b.Property<int>("IsActive");

                    b.Property<string>("Name");

                    b.Property<int?>("OrderId");

                    b.Property<string>("Path");

                    b.HasKey("ID");

                    b.HasIndex("OrderId");

                    b.ToTable("OrderDocuments");
                });

            modelBuilder.Entity("QuanLyDonHang.Domain.Models.OrderPayment", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedDate");

                    b.Property<int>("IsActive");

                    b.Property<string>("MoneyAccumulation");

                    b.Property<int>("OrderId");

                    b.Property<string>("PaymentAmount");

                    b.Property<int?>("PaymentDate");

                    b.Property<int>("PaymentType");

                    b.Property<int?>("Percent");

                    b.Property<string>("PercentAccumulation");

                    b.HasKey("ID");

                    b.HasIndex("OrderId");

                    b.ToTable("OrderPayments");
                });

            modelBuilder.Entity("QuanLyDonHang.Domain.Models.Provider", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AccountNumber");

                    b.Property<string>("Address");

                    b.Property<string>("BankName");

                    b.Property<int?>("CapitalCurrency");

                    b.Property<int>("CertificateProduct");

                    b.Property<string>("CharterCapital");

                    b.Property<string>("Code");

                    b.Property<string>("Contact");

                    b.Property<string>("ContactPhoneNumber");

                    b.Property<string>("ContructionType");

                    b.Property<int>("CreatedByID");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Email");

                    b.Property<string>("Fax");

                    b.Property<int>("IsActive");

                    b.Property<int?>("ModifiedByID");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<string>("Name");

                    b.Property<string>("Note");

                    b.Property<string>("OfficeAddress");

                    b.Property<string>("PhoneNumber");

                    b.Property<string>("ProductType");

                    b.Property<DateTime?>("RegistrationDate");

                    b.Property<string>("Representative");

                    b.Property<string>("Revenue");

                    b.Property<int?>("RevenueCurrency");

                    b.Property<string>("SubName");

                    b.Property<string>("Tax");

                    b.Property<int>("Type");

                    b.Property<string>("Web");

                    b.HasKey("ID");

                    b.ToTable("Providers");
                });

            modelBuilder.Entity("QuanLyDonHang.Domain.Models.User", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Email");

                    b.Property<DateTime?>("ExpPasswordToken");

                    b.Property<int>("IsActive");

                    b.Property<int?>("ModifiedBy");

                    b.Property<DateTime?>("ModifiedDate");

                    b.Property<string>("Password");

                    b.Property<string>("PasswordToken");

                    b.Property<string>("PhoneNumber");

                    b.Property<int>("Role");

                    b.Property<string>("Token");

                    b.Property<string>("Username");

                    b.HasKey("ID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("QuanLyDonHang.Domain.Models.Order", b =>
                {
                    b.HasOne("QuanLyDonHang.Domain.Models.Money")
                        .WithMany("Orders")
                        .HasForeignKey("MoneyID");

                    b.HasOne("QuanLyDonHang.Domain.Models.Provider", "Provider")
                        .WithMany("Orders")
                        .HasForeignKey("ProviderID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("QuanLyDonHang.Domain.Models.OrderDocument", b =>
                {
                    b.HasOne("QuanLyDonHang.Domain.Models.Order", "Orders")
                        .WithMany("OrderDocuments")
                        .HasForeignKey("OrderId");
                });

            modelBuilder.Entity("QuanLyDonHang.Domain.Models.OrderPayment", b =>
                {
                    b.HasOne("QuanLyDonHang.Domain.Models.Order", "Order")
                        .WithMany("OrderPayments")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
