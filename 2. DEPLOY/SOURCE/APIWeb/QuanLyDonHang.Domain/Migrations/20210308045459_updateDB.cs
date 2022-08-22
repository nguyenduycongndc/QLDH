using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class updateDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OtherCertificate",
                table: "Provider",
                newName: "CreatedByID");

            migrationBuilder.RenameColumn(
                name: "ISOCertificate",
                table: "Provider",
                newName: "CertificateProduct");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "Provider",
                nullable: true,
                oldClrType: typeof(DateTime));

            migrationBuilder.AddColumn<int>(
                name: "ModifiedByID",
                table: "Provider",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModifiedByID",
                table: "Provider");

            migrationBuilder.RenameColumn(
                name: "CreatedByID",
                table: "Provider",
                newName: "OtherCertificate");

            migrationBuilder.RenameColumn(
                name: "CertificateProduct",
                table: "Provider",
                newName: "ISOCertificate");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedDate",
                table: "Provider",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);
        }
    }
}
