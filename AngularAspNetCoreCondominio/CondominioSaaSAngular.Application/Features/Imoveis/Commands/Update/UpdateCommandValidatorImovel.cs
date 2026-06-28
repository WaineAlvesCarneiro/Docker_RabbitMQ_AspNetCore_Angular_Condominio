using CondominioSaaSAngular.Application.Features.Imoveis.Commands.ValidatorBase;

namespace CondominioSaaSAngular.Application.Features.Imoveis.Commands.Update;

public class UpdateCommandValidatorImovel : CommandValidatorBaseImovel<UpdateCommandImovel>
{
    public UpdateCommandValidatorImovel()
    {
        ConfigureCommonRules();
    }
}