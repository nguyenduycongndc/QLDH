using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class warehouseReceiptUp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ETA",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ETD",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RealityETA",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RealityETD",
                table: "warehouseReceipts",
                nullable: true);
        }
    }
}
