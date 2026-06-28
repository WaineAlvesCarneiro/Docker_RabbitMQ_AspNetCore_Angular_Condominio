using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Auth.Commands.DefinirSenha;

public class DefinirSenhaCommand : IRequest<Result<AuthUserDto>>
{
    public string UserName { get; set; } = string.Empty;
    public string NovaSenha { get; set; } = string.Empty;
}
