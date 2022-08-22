using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class WarehouseReceipt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "warehouseReceipts",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    IsActive = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    OrderId = table.Column<int>(nullable: false),
                    Content = table.Column<string>(nullable: true),
                    ConstructionDate = table.Column<DateTime>(nullable: false),
                    ETD = table.Column<int>(nullable: true),
                    ETA = table.Column<int>(nullable: true),
                    PortExport = table.Column<string>(nullable: false),
                    ContNumber = table.Column<int>(nullable: false),
                    RealityETD = table.Column<int>(nullable: true),
                    RealityETA = table.Column<int>(nullable: true),
                    RealityDate = table.Column<DateTime>(nullable: true),
                    Note = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_warehouseReceipts", x => x.ID);
                    table.ForeignKey(
                        name: "FK_warehouseReceipts_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_warehouseReceipts_OrderId",
                table: "warehouseReceipts",
                column: "OrderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "warehouseReceipts");
        }
    }
}
