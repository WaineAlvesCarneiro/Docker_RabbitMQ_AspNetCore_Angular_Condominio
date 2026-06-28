using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Features.Imoveis.Commands.ValidatorBase;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Imoveis.Commands.Update;

public record UpdateCommandImovel : IRequest<Result<ImovelDto>>, ICommandBaseImovel
{
    public long Id { get; set; }
    public required string Bloco { get; set; }
    public required string Apartamento { get; set; }
    public required string BoxGaragem { get; set; }
    public long EmpresaId { get; set; }
}