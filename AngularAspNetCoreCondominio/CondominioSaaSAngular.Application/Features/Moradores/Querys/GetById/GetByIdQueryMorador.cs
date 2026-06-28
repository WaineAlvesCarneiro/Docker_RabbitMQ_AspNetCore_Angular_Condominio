using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Moradores.Queries.GetById;

public record GetByIdQueryMorador(long Id) : IRequest<Result<MoradorDto>>;