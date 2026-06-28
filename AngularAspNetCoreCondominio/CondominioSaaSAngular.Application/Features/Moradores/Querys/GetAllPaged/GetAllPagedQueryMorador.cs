using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Moradores.Queries.GetAllPaged;

public record GetAllPagedQueryMorador(
    int Page = 1,
    int PageSize = 10,
    string? SortBy = "Id",
    string Direction = "ASC",
    long? EmpresaId = null,
    string? Nome = null)
        : IRequest<Result<PagedResult<MoradorDto>>>
{
    public int ActualPage => Page < 1 ? 1 : Page;
    public int ActualPageSize => PageSize < 1 ? 10 : PageSize;
    public string ActualSortBy => !string.IsNullOrWhiteSpace(SortBy) ? SortBy : "Id";
    public string ActualDirection => Direction;
}