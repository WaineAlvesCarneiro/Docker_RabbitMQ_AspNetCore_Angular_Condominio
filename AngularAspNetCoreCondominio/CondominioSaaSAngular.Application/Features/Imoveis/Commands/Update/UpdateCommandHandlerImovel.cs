using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Mappings;
using CondominioSaaSAngular.Domain.Common;
using CondominioSaaSAngular.Domain.Repositories;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Imoveis.Commands.Update;

public class UpdateCommandHandlerImovel(
    IImovelRepository repository)
        : IRequestHandler<UpdateCommandImovel, Result<ImovelDto>>
{
    public async Task<Result<ImovelDto>> Handle(UpdateCommandImovel request, CancellationToken cancellationToken)
    {
        var dadoToUpdate = await repository.GetByIdAsync(request.Id, cancellationToken);
        if (dadoToUpdate == null) return Result<ImovelDto>.Failure("Imóvel não encontrado.");

        dadoToUpdate.UpdateFromCommand(request);
        await repository.UpdateAsync(dadoToUpdate, cancellationToken);

        return Result<ImovelDto>.Success(dadoToUpdate.ToDto(), "Imóvel atualizado com sucesso.");
    }
}