using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Imoveis.Queries.GetAll;

public record GetAllQueryImovel(
    long? EmpresaId = null)
        : IRequest<Result<IEnumerable<ImovelDto>>>
{
    public long? IdEmpresa => EmpresaId;
}