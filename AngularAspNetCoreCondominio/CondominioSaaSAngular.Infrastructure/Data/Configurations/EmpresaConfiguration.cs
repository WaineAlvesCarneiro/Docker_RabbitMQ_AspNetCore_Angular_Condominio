using CondominioSaaSAngular.Domain.Entities;
using CondominioSaaSAngular.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CondominioSaaSAngular.Infrastructure.Data.Configurations;

public class EmpresaConfiguration : IEntityTypeConfiguration<Empresa>
{
    public void Configure(EntityTypeBuilder<Empresa> builder)
    {
        builder.ToTable("Empresa", "dbo");
        builder.HasKey(i => i.Id);

        builder.Property(u => u.Ativo)
            .HasDefaultValue(TipoEmpresaAtivo.Ativo)
            .HasSentinel((TipoEmpresaAtivo)(-1))
            .IsRequired();

        builder.Property(e => e.RazaoSocial)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.Fantasia)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.Cnpj)
            .HasMaxLength(18)
            .IsRequired();

        builder.Property(u => u.TipoDeCondominio)
            .HasSentinel((TipoCondominio)(-1))
            .IsRequired();

        builder.Property(m => m.Nome)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(m => m.Celular)
            .HasMaxLength(16)
            .IsRequired();

        builder.Property(m => m.Telefone)
            .HasMaxLength(15);

        builder.Property(m => m.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.Senha)
            .HasMaxLength(255);

        builder.Property(m => m.Host)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(m => m.Porta)
            .IsRequired();

        builder.Property(p => p.Cep)
            .HasMaxLength(14)
            .IsRequired();

        builder.Property(p => p.Uf)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(p => p.Cidade)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(p => p.Endereco)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(p => p.Complemento)
            .HasMaxLength(255);

        builder.Property(u => u.DataInclusao)
            .IsRequired();

        builder.Property(u => u.DataAlteracao);
    }
}