using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Auth.Commands.Delete;

public record DeleteCommandAuthUser(Guid Id) : IRequest<Result>;