using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CondominioSaaSAngular.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Inicio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dbo");

            migrationBuilder.CreateTable(
                name: "Empresa",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ativo = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    RazaoSocial = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Fantasia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Cnpj = table.Column<string>(type: "nvarchar(18)", maxLength: 18, nullable: false),
                    TipoDeCondominio = table.Column<int>(type: "int", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Celular = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Host = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Porta = table.Column<int>(type: "int", nullable: false),
                    Cep = table.Column<string>(type: "nvarchar(14)", maxLength: 14, nullable: false),
                    Uf = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Cidade = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Endereco = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Bairro = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Complemento = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    DataInclusao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataAlteracao = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empresa", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuthUsers",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Ativo = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    EmpresaAtiva = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    EmpresaId = table.Column<long>(type: "bigint", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PrimeiroAcesso = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    DataInclusao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataAlteracao = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuthUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuthUsers_Empresa_EmpresaId",
                        column: x => x.EmpresaId,
                        principalSchema: "dbo",
                        principalTable: "Empresa",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Imovel",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Bloco = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Apartamento = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BoxGaragem = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EmpresaId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Imovel", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Imovel_Empresa_EmpresaId",
                        column: x => x.EmpresaId,
                        principalSchema: "dbo",
                        principalTable: "Empresa",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Morador",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Celular = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IsProprietario = table.Column<bool>(type: "bit", nullable: false),
                    DataEntrada = table.Column<DateTime>(type: "date", nullable: false),
                    DataSaida = table.Column<DateTime>(type: "date", nullable: true),
                    DataInclusao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataAlteracao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ImovelId = table.Column<long>(type: "bigint", nullable: false),
                    EmpresaId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Morador", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Morador_Empresa_EmpresaId",
                        column: x => x.EmpresaId,
                        principalSchema: "dbo",
                        principalTable: "Empresa",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Morador_Imovel_ImovelId",
                        column: x => x.ImovelId,
                        principalSchema: "dbo",
                        principalTable: "Imovel",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuthUsers_EmpresaId",
                schema: "dbo",
                table: "AuthUsers",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_AuthUsers_PrimeiroAcesso",
                schema: "dbo",
                table: "AuthUsers",
                column: "PrimeiroAcesso");

            migrationBuilder.CreateIndex(
                name: "IX_AuthUsers_UserName",
                schema: "dbo",
                table: "AuthUsers",
                column: "UserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Imovel_EmpresaId",
                schema: "dbo",
                table: "Imovel",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_Morador_EmpresaId",
                schema: "dbo",
                table: "Morador",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_Morador_ImovelId",
                schema: "dbo",
                table: "Morador",
                column: "ImovelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuthUsers",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Morador",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Imovel",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Empresa",
                schema: "dbo");
        }
    }
}
