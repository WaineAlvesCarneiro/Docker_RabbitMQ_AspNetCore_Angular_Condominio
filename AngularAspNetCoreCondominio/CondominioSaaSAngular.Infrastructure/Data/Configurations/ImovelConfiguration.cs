using CondominioSaaSAngular.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CondominioSaaSAngular.Infrastructure.Data.Configurations;

public class ImovelConfiguration : IEntityTypeConfiguration<Imovel>
{
    public void Configure(EntityTypeBuilder<Imovel> builder)
    {
        builder.ToTable("Imovel", "dbo");
        builder.HasKey(i => i.Id);

        builder.Property(i => i.Bloco)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(i => i.Apartamento)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(i => i.BoxGaragem)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(m => m.EmpresaId)
            .HasColumnType("bigint")
            .IsRequired();

        builder.HasOne(m => m.Empresa)
            .WithMany(e => e.Imoveis)
            .HasForeignKey(m => m.EmpresaId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasMany<Morador>()
            .WithOne(m => m.Imovel)
            .HasForeignKey(m => m.ImovelId);

        builder.Navigation(i => i.Moradores)
            .HasField("_moradores");
    }
}