using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Moradores.Queries.GetAll;

public record GetAllQueryMorador(
    long? EmpresaId = null)
        : IRequest<Result<IEnumerable<MoradorDto>>>
{
    public long? IdEmpresa => EmpresaId;
}