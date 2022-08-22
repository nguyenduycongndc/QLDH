using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class updateWarehouseReceipt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeliveryProgress",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrderMoney",
                table: "warehouseReceipts",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeliveryProgress",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "OrderMoney",
                table: "warehouseReceipts");
        }
    }
}
