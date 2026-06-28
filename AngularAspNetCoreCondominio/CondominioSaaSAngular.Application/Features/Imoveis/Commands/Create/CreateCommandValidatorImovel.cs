using CondominioSaaSAngular.Application.Features.Imoveis.Commands.ValidatorBase;

namespace CondominioSaaSAngular.Application.Features.Imoveis.Commands.Create;

public class CreateCommandValidatorImovel : CommandValidatorBaseImovel<CreateCommandImovel>
{
    public CreateCommandValidatorImovel()
    {
        ConfigureCommonRules();
    }
}