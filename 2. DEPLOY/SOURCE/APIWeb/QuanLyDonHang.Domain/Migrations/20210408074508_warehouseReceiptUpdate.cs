using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class warehouseReceiptUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ETA",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ETD",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RealityETA",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RealityETD",
                table: "warehouseReceipts",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ETA",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "ETD",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "RealityETA",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "RealityETD",
                table: "warehouseReceipts");
        }
    }
}
