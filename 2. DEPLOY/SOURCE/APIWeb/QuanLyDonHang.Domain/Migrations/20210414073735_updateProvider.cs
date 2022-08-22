using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class updateProvider : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MoneyTypeCharterCapital",
                table: "Providers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MoneyTypeRevenue",
                table: "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SwiftCode",
                table: "Providers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MoneyTypeCharterCapital",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "MoneyTypeRevenue",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "SwiftCode",
                table: "Providers");
        }
    }
}
