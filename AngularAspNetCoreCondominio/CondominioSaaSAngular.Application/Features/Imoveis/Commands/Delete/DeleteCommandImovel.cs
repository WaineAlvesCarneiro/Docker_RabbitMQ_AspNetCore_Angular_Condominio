using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Imoveis.Commands.Delete;

public record DeleteCommandImovel(long Id) : IRequest<Result>;