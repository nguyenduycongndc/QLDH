using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class updateOrderNew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ConstructionCode",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentTerms",
                table: "Orders",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConstructionCode",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PaymentTerms",
                table: "Orders");
        }
    }
}
