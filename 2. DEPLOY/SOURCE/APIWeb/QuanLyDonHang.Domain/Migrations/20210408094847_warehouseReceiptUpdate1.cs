using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class warehouseReceiptUpdate1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_warehouseReceipts_Orders_OrderId",
                table: "warehouseReceipts");

            migrationBuilder.DropIndex(
                name: "IX_warehouseReceipts_OrderId",
                table: "warehouseReceipts");

            migrationBuilder.AddColumn<int>(
                name: "ProviderId",
                table: "warehouseReceipts",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WarehouseReceiptID",
                table: "Providers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WarehouseReceiptID",
                table: "Orders",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Providers_WarehouseReceiptID",
                table: "Providers",
                column: "WarehouseReceiptID");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Providers_warehouseReceipts_WarehouseReceiptID",
                table: "Providers",
                column: "WarehouseReceiptID",
                principalTable: "warehouseReceipts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_warehouseReceipts_WarehouseReceiptID",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Providers_warehouseReceipts_WarehouseReceiptID",
                table: "Providers");

            migrationBuilder.DropIndex(
                name: "IX_Providers_WarehouseReceiptID",
                table: "Providers");

            migrationBuilder.DropIndex(
                name: "IX_Orders_WarehouseReceiptID",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ProviderId",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "WarehouseReceiptID",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "WarehouseReceiptID",
                table: "Orders");

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
    }
}
