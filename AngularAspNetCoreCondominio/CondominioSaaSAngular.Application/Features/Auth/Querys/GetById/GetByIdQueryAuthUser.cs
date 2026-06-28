using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Auth.Queries.GetById;

public record GetByIdQueryAuthUser(Guid Id) : IRequest<Result<AuthUserDto>>;