using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class OrderPamentUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MoneyAccumulation",
                table: "OrderPayments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentAmount",
                table: "OrderPayments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PercentAccumulation",
                table: "OrderPayments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MoneyAccumulation",
                table: "OrderPayments");

            migrationBuilder.DropColumn(
                name: "PaymentAmount",
                table: "OrderPayments");

            migrationBuilder.DropColumn(
                name: "PercentAccumulation",
                table: "OrderPayments");
        }
    }
}
