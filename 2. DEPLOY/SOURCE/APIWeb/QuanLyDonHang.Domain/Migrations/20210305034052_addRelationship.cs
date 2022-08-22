using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace QuanLyDonHang.Domain.Migrations
{
    public partial class addRelationship : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDocument_Orders_OrderID",
                table: "OrderDocument");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderPayment_Orders_OrderID",
                table: "OrderPayment");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Money_MoneyTypeID",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_UserID",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_MoneyTypeID",
                table: "Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderPayment",
                table: "OrderPayment");

            migrationBuilder.DropIndex(
                name: "IX_OrderPayment_OrderID",
                table: "OrderPayment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderDocument",
                table: "OrderDocument");

            migrationBuilder.DropIndex(
                name: "IX_OrderDocument_OrderID",
                table: "OrderDocument");

            migrationBuilder.RenameTable(
                name: "OrderPayment",
                newName: "OrderPayments");

            migrationBuilder.RenameTable(
                name: "OrderDocument",
                newName: "OrderDocuments");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Orders",
                newName: "MoneyID");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_UserID",
                table: "Orders",
                newName: "IX_Orders_MoneyID");

            migrationBuilder.RenameColumn(
                name: "OrderID",
                table: "OrderPayments",
                newName: "OrderId");

            migrationBuilder.RenameColumn(
                name: "OrderID",
                table: "OrderDocuments",
                newName: "OrderId");

            migrationBuilder.AddColumn<int>(
                name: "ProviderID",
                table: "Orders",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderPayments",
                table: "OrderPayments",
                column: "ID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderDocuments",
                table: "OrderDocuments",
                column: "ID");

            migrationBuilder.CreateTable(
                name: "Provider",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    IsActive = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    Code = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Representative = table.Column<string>(nullable: true),
                    Tax = table.Column<string>(nullable: true),
                    OfficeAddress = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    ISOCertificate = table.Column<int>(nullable: false),
                    OtherCertificate = table.Column<int>(nullable: false),
                    Fax = table.Column<string>(nullable: true),
                    Contact = table.Column<string>(nullable: true),
                    ContactPhoneNumber = table.Column<string>(nullable: true),
                    RegistrationDate = table.Column<DateTime>(nullable: false),
                    ProductType = table.Column<string>(nullable: true),
                    ContructionType = table.Column<string>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Provider", x => x.ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ProviderID",
                table: "Orders",
                column: "ProviderID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderPayments_OrderId",
                table: "OrderPayments",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDocuments_OrderId",
                table: "OrderDocuments",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDocuments_Orders_OrderId",
                table: "OrderDocuments",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderPayments_Orders_OrderId",
                table: "OrderPayments",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Money_MoneyID",
                table: "Orders",
                column: "MoneyID",
                principalTable: "Money",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Provider_ProviderID",
                table: "Orders",
                column: "ProviderID",
                principalTable: "Provider",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDocuments_Orders_OrderId",
                table: "OrderDocuments");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderPayments_Orders_OrderId",
                table: "OrderPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Money_MoneyID",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Provider_ProviderID",
                table: "Orders");

            migrationBuilder.DropTable(
                name: "Provider");

            migrationBuilder.DropIndex(
                name: "IX_Orders_ProviderID",
                table: "Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderPayments",
                table: "OrderPayments");

            migrationBuilder.DropIndex(
                name: "IX_OrderPayments_OrderId",
                table: "OrderPayments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderDocuments",
                table: "OrderDocuments");

            migrationBuilder.DropIndex(
                name: "IX_OrderDocuments_OrderId",
                table: "OrderDocuments");

            migrationBuilder.DropColumn(
                name: "ProviderID",
                table: "Orders");

            migrationBuilder.RenameTable(
                name: "OrderPayments",
                newName: "OrderPayment");

            migrationBuilder.RenameTable(
                name: "OrderDocuments",
                newName: "OrderDocument");

            migrationBuilder.RenameColumn(
                name: "MoneyID",
                table: "Orders",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_MoneyID",
                table: "Orders",
                newName: "IX_Orders_UserID");

            migrationBuilder.RenameColumn(
                name: "OrderId",
                table: "OrderPayment",
                newName: "OrderID");

            migrationBuilder.RenameColumn(
                name: "OrderId",
                table: "OrderDocument",
                newName: "OrderID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderPayment",
                table: "OrderPayment",
                column: "ID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderDocument",
                table: "OrderDocument",
                column: "ID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_MoneyTypeID",
                table: "Orders",
                column: "MoneyTypeID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderPayment_OrderID",
                table: "OrderPayment",
                column: "OrderID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderDocument_OrderID",
                table: "OrderDocument",
                column: "OrderID",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDocument_Orders_OrderID",
                table: "OrderDocument",
                column: "OrderID",
                principalTable: "Orders",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderPayment_Orders_OrderID",
                table: "OrderPayment",
                column: "OrderID",
                principalTable: "Orders",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Money_MoneyTypeID",
                table: "Orders",
                column: "MoneyTypeID",
                principalTable: "Money",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_UserID",
                table: "Orders",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
