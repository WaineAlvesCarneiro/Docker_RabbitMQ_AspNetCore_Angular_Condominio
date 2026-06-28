using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Features.Auth.Commands.Create;
using CondominioSaaSAngular.Application.Features.Auth.Commands.Update;
using CondominioSaaSAngular.Application.Helpers;
using CondominioSaaSAngular.Domain.Entities.Auth;
using CondominioSaaSAngular.Domain.Enums;
using Microsoft.Extensions.Configuration;

namespace CondominioSaaSAngular.Application.Mappings;

public static class AuthUserMappingExtensions
{
    public static AuthUser ToEntityMigrateAndSeedDatabase(this IConfiguration configuration)
    {
        return new AuthUser
        {
            EmpresaId = null,
            Ativo = TipoUserAtivo.Ativo,
            EmpresaAtiva = TipoEmpresaAtivo.Ativo,
            UserName = configuration["AdminSettings:UserName"] ?? "Admin",
            Email = configuration["AdminSettings:Email"] ?? "emailadmin@gmail.com",
            PrimeiroAcesso = true,
            PasswordHash = PasswordHasher.HashPassword(configuration["AdminSettings:Password"] ?? "12345"),
            Role = TipoRole.Suporte,
            DataInclusao = DateTime.Now
        };
    }

    public static AuthUser ToEntity(this CreateCommandAuthUser request, string senhaTemporaria)
    {
        return new AuthUser
        {
            EmpresaId = request.EmpresaId,
            UserName = request.UserName,
            Email = request.Email,
            PrimeiroAcesso = true,
            PasswordHash = PasswordHasher.HashPassword(senhaTemporaria),
            Role = request.Role,
            DataInclusao = DateTime.Now,
            Ativo = TipoUserAtivo.Ativo,
            EmpresaAtiva = TipoEmpresaAtivo.Ativo
        };
    }

    public static void UpdateFromCommand(this AuthUser entidade, UpdateCommandAuthUser request)
    {
        entidade.UserName = request.UserName;
        entidade.Email = request.Email;
        entidade.Role = (TipoRole)request.Role!;
        entidade.Ativo = request.Ativo;
        entidade.EmpresaAtiva = request.EmpresaAtiva;
        entidade.DataAlteracao = DateTime.Now;
    }

    public static AuthUserDto ToDto(this AuthUser dado) => new()
    {
        Id = dado.Id,
        Ativo = dado.Ativo,
        EmpresaAtiva = dado.EmpresaAtiva,
        EmpresaId = dado.EmpresaId,
        UserName = dado.UserName,
        Email = dado.Email,
        PrimeiroAcesso = dado.PrimeiroAcesso,
        Role = dado.Role,
        DataInclusao = dado.DataInclusao,
        DataAlteracao = dado.DataAlteracao,
        EmpresaDto = dado.Empresa?.ToDto()
    };
}