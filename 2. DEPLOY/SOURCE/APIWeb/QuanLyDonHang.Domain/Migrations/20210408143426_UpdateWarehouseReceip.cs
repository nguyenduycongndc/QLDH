using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class UpdateWarehouseReceip : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_warehouseReceipts_WarehouseReceiptID",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_WarehouseReceiptID",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "WarehouseReceiptID",
                table: "Orders");

            migrationBuilder.AddColumn<string>(
                name: "ProviderName",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_warehouseReceipts_OrderId",
                table: "warehouseReceipts",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_warehouseReceipts_Orders_OrderId",
                table: "warehouseReceipts",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_warehouseReceipts_Orders_OrderId",
                table: "warehouseReceipts");

            migrationBuilder.DropIndex(
                name: "IX_warehouseReceipts_OrderId",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "ProviderName",
                table: "warehouseReceipts");

            migrationBuilder.AddColumn<int>(
                name: "WarehouseReceiptID",
                table: "Orders",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_WarehouseReceiptID",
                table: "Orders",
                column: "WarehouseReceiptID");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_warehouseReceipts_WarehouseReceiptID",
                table: "Orders",
                column: "WarehouseReceiptID",
                principalTable: "warehouseReceipts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
