using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class ThemtruongDonHang1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AmountMoney",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AmountMoneyType",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EstimatedCategory",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EstimatedName",
                table: "Orders",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AmountMoney",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "AmountMoneyType",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "EstimatedCategory",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "EstimatedName",
                table: "Orders");
        }
    }
}
