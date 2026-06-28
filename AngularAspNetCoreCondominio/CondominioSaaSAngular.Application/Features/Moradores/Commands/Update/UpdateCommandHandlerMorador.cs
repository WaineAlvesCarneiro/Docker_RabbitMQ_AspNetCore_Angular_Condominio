using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Mappings;
using CondominioSaaSAngular.Domain.Common;
using CondominioSaaSAngular.Domain.Entities;
using CondominioSaaSAngular.Domain.Interfaces;
using CondominioSaaSAngular.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CondominioSaaSAngular.Application.Features.Moradores.Commands.Update;

public class UpdateCommandHandlerMorador(
    IMoradorRepository repository,
    IImovelRepository imovelRepository,
    IMensageriaService mensageriaService,
    IEmailTemplateService emailTemplateService,
    ILogger<UpdateCommandHandlerMorador> logger)
        : IRequestHandler<UpdateCommandMorador, Result<MoradorDto>>
{
    public async Task<Result<MoradorDto>> Handle(UpdateCommandMorador request, CancellationToken cancellationToken)
    {
        var dadoToUpdate = await repository.GetByIdAsync(request.Id, cancellationToken);
        if (dadoToUpdate == null) return Result<MoradorDto>.Failure("Morador não encontrado.");

        var imovelExist = await imovelRepository.GetByIdAsync(request.ImovelId, cancellationToken);
        if (imovelExist == null) return Result<MoradorDto>.Failure("O imóvel informado não existe.");

        dadoToUpdate.UpdateFromCommand(request);
        await repository.UpdateAsync(dadoToUpdate, cancellationToken);

        await EnviarEmailAlteracoesAsync(dadoToUpdate);

        return Result<MoradorDto>.Success(dadoToUpdate.ToDto(), "Morador atualizado com sucesso.");
    }

    private async Task EnviarEmailAlteracoesAsync(Morador dadoToUpdate)
    {
        try
        {
            var corpoEmail = emailTemplateService.GerarMoradorAlterado(dadoToUpdate.Nome);
            var emailRequest = new EnvioEmailRequest(
                dadoToUpdate.Email,
                "Morador alteração de Dados Cadastrais",
                corpoEmail,
                dadoToUpdate.Id
            );

            await mensageriaService.PublicarMensagemAsync(emailRequest);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[Update Morador] Falha ao enfileirar e-mail para {Email}", dadoToUpdate.Email);
        }
    }
}