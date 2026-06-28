using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Features.Imoveis.Commands.Create;
using CondominioSaaSAngular.Application.Features.Imoveis.Commands.Update;
using CondominioSaaSAngular.Domain.Entities;

namespace CondominioSaaSAngular.Application.Mappings;

public static class ImovelMappingExtensions
{
    public static Imovel ToEntity(this CreateCommandImovel request) => new()
    {
        Bloco = request.Bloco,
        Apartamento = request.Apartamento,
        BoxGaragem = request.BoxGaragem,
        EmpresaId = request.EmpresaId
    };

    public static void UpdateFromCommand(this Imovel imovel, UpdateCommandImovel request)
    {
        imovel.Bloco = request.Bloco;
        imovel.Apartamento = request.Apartamento;
        imovel.BoxGaragem = request.BoxGaragem;
    }

    public static ImovelDto ToDto(this Imovel dado) => new()
    {
        Id = dado.Id,
        Bloco = dado.Bloco,
        Apartamento = dado.Apartamento,
        BoxGaragem = dado.BoxGaragem,
        EmpresaId = dado.EmpresaId,
        EmpresaDto = dado.Empresa?.ToDto()
    };
}