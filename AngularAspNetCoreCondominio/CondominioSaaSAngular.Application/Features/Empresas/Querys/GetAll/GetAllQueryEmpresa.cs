using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Empresas.Queries.GetAll;

public record GetAllQueryEmpresa(
    long? EmpresaId = null)
        : IRequest<Result<IEnumerable<EmpresaDto>>>
{
    public long? IdEmpresa => EmpresaId;
}