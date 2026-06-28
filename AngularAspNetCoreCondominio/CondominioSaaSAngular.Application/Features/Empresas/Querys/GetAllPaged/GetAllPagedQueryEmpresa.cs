using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Empresas.Queries.GetAllPaged;

public record GetAllPagedQueryEmpresa(
    int Page = 1,
    int PageSize = 10,
    string? SortBy = "Id",
    string Direction = "ASC",
    string? RazaoSocial = null,
    string? Cnpj = null)
    : IRequest<Result<PagedResult<EmpresaDto>>>
{
    public int ActualPage => Page < 1 ? 1 : Page;
    public int ActualPageSize => PageSize < 1 ? 10 : PageSize;
    public string ActualSortBy => !string.IsNullOrWhiteSpace(SortBy) ? SortBy : "Id";
    public string ActualDirection => Direction;
}