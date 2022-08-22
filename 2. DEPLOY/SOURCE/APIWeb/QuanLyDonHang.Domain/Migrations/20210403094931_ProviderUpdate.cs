using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class ProviderUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CapitalCurrency",
                table: "Providers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RevenueCurrency",
                table: "Providers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CapitalCurrency",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "RevenueCurrency",
                table: "Providers");
        }
    }
}
