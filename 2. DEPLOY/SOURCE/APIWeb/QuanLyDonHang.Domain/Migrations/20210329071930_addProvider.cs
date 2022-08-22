using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class addProvider : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AccountNumber",
                table: "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BankName",
                table: "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CharterCapital",
                table: "Providers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Note",
                table: "Providers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Revenue",
                table: "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubName",
                table: "Providers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Providers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Web",
                table: "Providers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccountNumber",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "BankName",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "CharterCapital",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "Revenue",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "SubName",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Providers");

            migrationBuilder.DropColumn(
                name: "Web",
                table: "Providers");
        }
    }
}
