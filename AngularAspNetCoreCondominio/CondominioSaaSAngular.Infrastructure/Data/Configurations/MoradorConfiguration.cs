using CondominioSaaSAngular.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CondominioSaaSAngular.Infrastructure.Data.Configurations;

public class MoradorConfiguration : IEntityTypeConfiguration<Morador>
{
    public void Configure(EntityTypeBuilder<Morador> builder)
    {
        builder.ToTable("Morador", "dbo");
        builder.HasKey(m => m.Id);

        builder.Property(m => m.Nome)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(m => m.Celular)
            .HasMaxLength(16)
            .IsRequired();

        builder.Property(m => m.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.IsProprietario)
            .IsRequired();

        builder.Property(m => m.DataEntrada)
            .IsRequired();

        builder.Property(m => m.DataSaida);

        builder.Property(u => u.DataInclusao)
            .IsRequired();

        builder.Property(u => u.DataAlteracao);

        builder.Property(m => m.ImovelId)
            .HasColumnType("bigint")
            .IsRequired();

        builder.Property(m => m.EmpresaId)
            .HasColumnType("bigint")
            .IsRequired();

        builder.HasOne(m => m.Imovel)
            .WithMany(i => i.Moradores)
            .HasForeignKey(m => m.ImovelId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(m => m.Empresa)
            .WithMany(e => e.Moradores)
            .HasForeignKey(m => m.EmpresaId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}