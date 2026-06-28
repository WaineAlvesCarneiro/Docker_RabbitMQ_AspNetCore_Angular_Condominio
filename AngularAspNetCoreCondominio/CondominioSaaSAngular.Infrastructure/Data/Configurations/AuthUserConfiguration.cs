using CondominioSaaSAngular.Domain.Entities.Auth;
using CondominioSaaSAngular.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CondominioSaaSAngular.Infrastructure.Data.Configurations;

public class AuthUserConfiguration : IEntityTypeConfiguration<AuthUser>
{
    public void Configure(EntityTypeBuilder<AuthUser> builder)
    {
        builder.ToTable("AuthUsers", "dbo");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id)
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(u => u.Ativo)
            .HasDefaultValue(TipoUserAtivo.Ativo)
            .HasSentinel((TipoUserAtivo)(-1))
            .IsRequired();

        builder.Property(u => u.EmpresaAtiva)
            .HasDefaultValue(TipoEmpresaAtivo.Ativo)
            .HasSentinel((TipoEmpresaAtivo)(-1))
            .IsRequired();

        builder.Property(u => u.UserName)
            .HasMaxLength(100)
            .IsRequired();
        builder.HasIndex(u => u.UserName).IsUnique();

        builder.Property(m => m.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(u => u.PrimeiroAcesso);

        builder.Property(u => u.PasswordHash)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(u => u.Role)
            .IsRequired();

        builder.Property(u => u.DataInclusao)
            .IsRequired();

        builder.Property(u => u.DataAlteracao);

        builder.Property(m => m.EmpresaId)
            .HasColumnType("bigint")
            .HasDefaultValue(null)
            .IsRequired(false);

        builder.HasOne(m => m.Empresa)
            .WithMany(e => e.AuthUsers)
            .HasForeignKey(m => m.EmpresaId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
