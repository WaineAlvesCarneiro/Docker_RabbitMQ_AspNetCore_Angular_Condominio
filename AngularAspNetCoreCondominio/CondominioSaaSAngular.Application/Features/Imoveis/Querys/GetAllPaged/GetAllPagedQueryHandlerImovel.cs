using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Mappings;
using CondominioSaaSAngular.Domain.Common;
using CondominioSaaSAngular.Domain.Entities;
using CondominioSaaSAngular.Domain.Repositories;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Imoveis.Queries.GetAllPaged;

public record GetAllPagedQueryHandlerImovel(IImovelRepository repository)
    : IRequestHandler<GetAllPagedQueryImovel, Result<PagedResult<ImovelDto>>>
{
    private readonly IImovelRepository _repository = repository;

    public async Task<Result<PagedResult<ImovelDto>>> Handle(GetAllPagedQueryImovel request, CancellationToken cancellationToken)
    {
        (IEnumerable<Imovel> items, int totalCount) = await _repository.GetAllPagedAsync(
            page: request.ActualPage,
            pageSize: request.ActualPageSize,
            orderBy: request.ActualSortBy,
            direction: request.ActualDirection,
            empresaId: request.EmpresaId,
            bloco: request.Bloco,
            apartamento: request.Apartamento,
            cancellationToken);

        var dtos = items.Select(dado => dado.ToDto()).ToList();

        return Result<PagedResult<ImovelDto>>.Success(new PagedResult<ImovelDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageIndex = request.ActualPage,
            LinesPerPage = request.ActualPageSize
        });
    }
}