using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class UdOrderDocument : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDocuments_Orders_OrderId",
                table: "OrderDocuments");

            migrationBuilder.AlterColumn<int>(
                name: "OrderId",
                table: "OrderDocuments",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDocuments_Orders_OrderId",
                table: "OrderDocuments",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDocuments_Orders_OrderId",
                table: "OrderDocuments");

            migrationBuilder.AlterColumn<int>(
                name: "OrderId",
                table: "OrderDocuments",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDocuments_Orders_OrderId",
                table: "OrderDocuments",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
