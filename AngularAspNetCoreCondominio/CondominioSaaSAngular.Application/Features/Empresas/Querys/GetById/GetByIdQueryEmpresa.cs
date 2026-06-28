using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Empresas.Queries.GetById;

public record GetByIdQueryEmpresa(long Id) : IRequest<Result<EmpresaDto>>;