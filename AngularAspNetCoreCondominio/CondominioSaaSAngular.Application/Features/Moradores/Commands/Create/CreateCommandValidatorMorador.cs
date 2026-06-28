using CondominioSaaSAngular.Application.Features.Moradores.Commands.ValidatorBase;

namespace CondominioSaaSAngular.Application.Features.Moradores.Commands.Create;

public class CreateCommandValidatorMorador : CommandValidatorBaseMorador<CreateCommandMorador>
{
    public CreateCommandValidatorMorador()
    {
        ConfigureCommonRules();
    }
}