using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Auth.Queries.GetAll;

public record GetAllQueryAuthUser(
    long? EmpresaId = null)
        : IRequest<Result<IEnumerable<AuthUserDto>>>
{
    public long? IdEmpresa => EmpresaId;
}