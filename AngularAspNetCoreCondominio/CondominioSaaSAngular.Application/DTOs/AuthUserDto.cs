using CondominioSaaSAngular.Domain.Enums;

namespace CondominioSaaSAngular.Application.DTOs;

public record AuthUserDto
{
    public Guid Id { get; set; }
    public TipoUserAtivo Ativo { get; set; }
    public TipoEmpresaAtivo EmpresaAtiva { get; set; }
    public long? EmpresaId { get; set; }
    public EmpresaDto? EmpresaDto { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public bool PrimeiroAcesso { get; set; } = true;
    public TipoRole Role { get; set; }
    public DateTime DataInclusao { get; set; }
    public DateTime? DataAlteracao { get; set; }
}
