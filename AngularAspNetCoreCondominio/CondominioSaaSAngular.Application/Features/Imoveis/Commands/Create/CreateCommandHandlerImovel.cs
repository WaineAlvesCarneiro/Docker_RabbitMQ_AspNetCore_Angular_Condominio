using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Mappings;
using CondominioSaaSAngular.Domain.Common;
using CondominioSaaSAngular.Domain.Entities;
using CondominioSaaSAngular.Domain.Repositories;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Imoveis.Commands.Create;

public class CreateCommandHandlerImovel(
    IImovelRepository repository)
        : IRequestHandler<CreateCommandImovel, Result<ImovelDto>>
{
    public async Task<Result<ImovelDto>> Handle(CreateCommandImovel request, CancellationToken cancellationToken)
    {
        Imovel dado = request.ToEntity();
        await repository.CreateAsync(dado, cancellationToken);

        return Result<ImovelDto>.Success(dado.ToDto(), "Imóvel criado com sucesso.");
    }
}