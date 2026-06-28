using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Mappings;
using CondominioSaaSAngular.Domain.Common;
using CondominioSaaSAngular.Domain.Repositories;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Empresas.Queries.GetAll;

public class GetAllQueryHandlerEmpresa(IEmpresaRepository repository)
    : IRequestHandler<GetAllQueryEmpresa, Result<IEnumerable<EmpresaDto>>>
{
    public async Task<Result<IEnumerable<EmpresaDto>>> Handle(GetAllQueryEmpresa request, CancellationToken cancellationToken)
    {
        var dados = await repository.GetAllAsync(
            empresaId: request.IdEmpresa, cancellationToken);

        var dtos = dados.Select(dado => dado.ToDto()).ToList();

        return Result<IEnumerable<EmpresaDto>>.Success(dtos);
    }
}
