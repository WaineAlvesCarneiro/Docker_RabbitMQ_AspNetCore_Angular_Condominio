using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Moradores.Commands.Delete;

public record DeleteCommandMorador(long Id) : IRequest<Result>;