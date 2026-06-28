using CondominioSaaSAngular.Application.Features.Auth.Commands.ValidatorBase;
using CondominioSaaSAngular.Domain.Enums;
using FluentValidation;

namespace CondominioSaaSAngular.Application.Features.Auth.Commands.Create;

public class CreateCommandValidatorAuthUser : CommandValidatorBaseAuthUser<CreateCommandAuthUser>
{
    public CreateCommandValidatorAuthUser()
    {
        ConfigureCommonRules();

        RuleFor(p => p.Role)
            .Must(x => Enum.IsDefined(typeof(TipoRole), x))
            .WithMessage("Tipo de Perfil inválido. Selecione uma opção válida.");

        RuleFor(p => p.EmpresaId)
            .Cascade(CascadeMode.Stop)
            .Must((command, empresaId) =>
            {
                if (command.Role == TipoRole.Sindico || command.Role == TipoRole.Porteiro)
                {
                    return empresaId.HasValue && empresaId.Value > 0;
                }
                return true;
            })
            .WithMessage("EmpresaId é obrigatório para perfis Síndico e Porteiro.");
    }
}