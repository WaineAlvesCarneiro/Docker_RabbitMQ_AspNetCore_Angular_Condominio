using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Empresas.Commands.Delete;

public record DeleteCommandEmpresa(long Id) : IRequest<Result>;