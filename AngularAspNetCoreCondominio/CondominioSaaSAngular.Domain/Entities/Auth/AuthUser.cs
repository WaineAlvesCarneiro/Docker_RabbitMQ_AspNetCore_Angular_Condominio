using CondominioSaaSAngular.Domain.Enums;

namespace CondominioSaaSAngular.Domain.Entities.Auth;

public class AuthUser
{
    public Guid Id { get; set; }
    public TipoUserAtivo Ativo { get; set; }
    public TipoEmpresaAtivo EmpresaAtiva { get; set; }
    public long? EmpresaId { get; set; }
    public virtual Empresa? Empresa { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public bool PrimeiroAcesso { get; set; } = true;
    public required string PasswordHash { get; set; }
    public TipoRole Role { get; set; }
    public DateTime DataInclusao { get; set; }
    public DateTime? DataAlteracao { get; set; }

    public bool VerificarSenha(string senhaBruta)
    {
        return BCrypt.Net.BCrypt.Verify(senhaBruta, this.PasswordHash);
    }
}
