using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Helpers;
using CondominioSaaSAngular.Application.Mappings;
using CondominioSaaSAngular.Domain.Common;
using CondominioSaaSAngular.Domain.Entities.Auth;
using CondominioSaaSAngular.Domain.Interfaces;
using CondominioSaaSAngular.Domain.Repositories.Auth;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CondominioSaaSAngular.Application.Features.Auth.Commands.Create;

public record CreateCommandHandlerAuthUser(
    IAuthUserRepository repository,
    IMensageriaService mensageriaService,
    IEmailTemplateService emailTemplateService,
    ILogger<CreateCommandHandlerAuthUser> logger)
        : IRequestHandler<CreateCommandAuthUser, Result<AuthUserDto>>
{
    public async Task<Result<AuthUserDto>> Handle(CreateCommandAuthUser request, CancellationToken cancellationToken)
    {
        int quantidadeDeCaracteresSenhaAleatoria = 5;
        string senhaTemporaria = PasswordHasher.GerarSenhaAleatoria(quantidadeDeCaracteresSenhaAleatoria);
        AuthUser dado = request.ToEntity(senhaTemporaria);
        await repository.CreateAsync(dado, cancellationToken);

        await EnviarEmailBoasVindasAsync(dado, senhaTemporaria);

        return Result<AuthUserDto>.Success(dado.ToDto(), "Usuário criado com sucesso.");
    }

    private async Task EnviarEmailBoasVindasAsync(AuthUser dado, string senhaTemporaria)
    {
        try
        {
            var corpoEmail = emailTemplateService.GerarBoasVindasUsuario(dado.UserName, senhaTemporaria);
            var emailRequest = new EnvioEmailRequest(
                dado.Email,
                "Bem-vindo ao Sistema",
                corpoEmail,
                dado.EmpresaId.GetValueOrDefault()
            );

            await mensageriaService.PublicarMensagemAsync(emailRequest);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[Create AuthUser] Falha ao enfileirar e-mail para {Email}", dado.Email);
        }
    }
}