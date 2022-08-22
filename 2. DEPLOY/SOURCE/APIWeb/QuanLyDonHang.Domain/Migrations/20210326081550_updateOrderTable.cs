using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class updateOrderTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentDate",
                table: "OrderPayments");

            migrationBuilder.AddColumn<string>(
                name: "AmountAfterTax",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Rate",
                table: "Orders",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AmountAfterTax",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Rate",
                table: "Orders");

            migrationBuilder.AddColumn<DateTime>(
                name: "PaymentDate",
                table: "OrderPayments",
                nullable: true);
        }
    }
}
