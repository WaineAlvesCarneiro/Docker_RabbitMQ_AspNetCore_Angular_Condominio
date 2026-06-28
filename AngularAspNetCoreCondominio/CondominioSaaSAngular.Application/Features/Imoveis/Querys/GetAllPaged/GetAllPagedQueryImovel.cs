using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Imoveis.Queries.GetAllPaged;

public record GetAllPagedQueryImovel(
    int Page = 1,
    int PageSize = 10,
    string? SortBy = "Id",
    string Direction = "ASC",
    long? EmpresaId = null,
    string? Bloco = null,
    string? Apartamento = null)
        : IRequest<Result<PagedResult<ImovelDto>>>
{
    public int ActualPage => Page < 1 ? 1 : Page;
    public int ActualPageSize => PageSize < 1 ? 10 : PageSize;
    public string ActualSortBy => !string.IsNullOrWhiteSpace(SortBy) ? SortBy : "Id";
    public string ActualDirection => Direction;
}