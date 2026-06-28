using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Imoveis.Queries.GetById;

public record GetByIdQueryImovel(long Id) : IRequest<Result<ImovelDto>>;