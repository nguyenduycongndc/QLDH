using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class updateWarehouseReceiptNew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderMoneyType",
                table: "warehouseReceipts",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderMoneyType",
                table: "warehouseReceipts");
        }
    }
}
