using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Features.Moradores.Commands.ValidatorBase;
using CondominioSaaSAngular.Domain.Common;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Moradores.Commands.Create;

public record CreateCommandMorador : IRequest<Result<MoradorDto>>, ICommandBaseMorador
{
    public long Id { get; set; }
    public required string Nome { get; set; }
    public required string Celular { get; set; }
    public required string Email { get; set; }
    public bool IsProprietario { get; set; }
    public DateOnly DataEntrada { get; set; }
    public DateTime DataInclusao { get; set; }
    public DateOnly? DataSaida { get; set; }
    public DateTime? DataAlteracao { get; set; }
    public long ImovelId { get; set; }
    public long EmpresaId { get; set; }
}