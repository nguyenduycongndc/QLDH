using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class updateDb10110h : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactCode",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContructionName",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OutOfDate",
                table: "Orders",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "WarrantyPeriod",
                table: "Orders",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactCode",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ContructionName",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "OutOfDate",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "WarrantyPeriod",
                table: "Orders");
        }
    }
}
