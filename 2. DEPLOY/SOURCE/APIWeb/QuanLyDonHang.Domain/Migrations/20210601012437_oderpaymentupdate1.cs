using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class oderpaymentupdate1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AmountOfAcceptance",
                table: "OrderPayments",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AmountOfAcceptanceType",
                table: "OrderPayments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NumberOfTests",
                table: "OrderPayments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceiveCode",
                table: "OrderPayments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceiveDate",
                table: "OrderPayments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AmountOfAcceptance",
                table: "OrderPayments");

            migrationBuilder.DropColumn(
                name: "AmountOfAcceptanceType",
                table: "OrderPayments");

            migrationBuilder.DropColumn(
                name: "NumberOfTests",
                table: "OrderPayments");

            migrationBuilder.DropColumn(
                name: "ReceiveCode",
                table: "OrderPayments");

            migrationBuilder.DropColumn(
                name: "ReceiveDate",
                table: "OrderPayments");
        }
    }
}
