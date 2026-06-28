using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Features.Auth.Commands.ValidatorBase;
using CondominioSaaSAngular.Domain.Common;
using CondominioSaaSAngular.Domain.Enums;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Auth.Commands.Update;

public class UpdateCommandAuthUser : IRequest<Result<AuthUserDto>>, ICommandBaseAuthUser
{
    public Guid Id { get; set; }
    public TipoUserAtivo Ativo { get; set; }
    public TipoEmpresaAtivo EmpresaAtiva { get; set; }
    public long? EmpresaId { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public TipoRole? Role { get; set; }
    public DateTime DataInclusao { get; set; }
    public DateTime? DataAlteracao { get; set; }
}