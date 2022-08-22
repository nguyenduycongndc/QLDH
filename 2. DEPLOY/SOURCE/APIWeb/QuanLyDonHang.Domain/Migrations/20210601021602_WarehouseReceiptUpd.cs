using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class WarehouseReceiptUpd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AgentMoney",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AgentMoneyType",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtherMoney",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OtherMoneyType",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentTerms",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShippingDocuments",
                table: "warehouseReceipts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TermsOfSale",
                table: "warehouseReceipts",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AgentMoney",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "AgentMoneyType",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "OtherMoney",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "OtherMoneyType",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "PaymentTerms",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "ShippingDocuments",
                table: "warehouseReceipts");

            migrationBuilder.DropColumn(
                name: "TermsOfSale",
                table: "warehouseReceipts");
        }
    }
}
