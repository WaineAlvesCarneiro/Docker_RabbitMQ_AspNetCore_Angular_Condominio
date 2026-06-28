using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Mappings;
using CondominioSaaSAngular.Domain.Common;
using CondominioSaaSAngular.Domain.Entities;
using CondominioSaaSAngular.Domain.Repositories;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Moradores.Queries.GetAllPaged;

public class GetAllPagedQueryHandlerMorador(IMoradorRepository repository)
    : IRequestHandler<GetAllPagedQueryMorador, Result<PagedResult<MoradorDto>>>
{
    private readonly IMoradorRepository _repository = repository;

    public async Task<Result<PagedResult<MoradorDto>>> Handle(GetAllPagedQueryMorador request, CancellationToken cancellationToken)
    {
        (IEnumerable<Morador> items, int totalCount) = await _repository.GetAllPagedAsync(
            page: request.ActualPage,
            pageSize: request.ActualPageSize,
            orderBy: request.ActualSortBy,
            direction: request.ActualDirection,
            empresaId: request.EmpresaId,
            nome: request.Nome,
            cancellationToken: cancellationToken);

        var dtos = items.Select(dado => dado.ToDto()).ToList();

        return Result<PagedResult<MoradorDto>>.Success(new PagedResult<MoradorDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageIndex = request.ActualPage,
            LinesPerPage = request.ActualPageSize
        });
    }
}