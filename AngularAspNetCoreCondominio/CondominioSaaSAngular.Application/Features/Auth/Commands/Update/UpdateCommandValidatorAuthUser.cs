using CondominioSaaSAngular.Application.Features.Auth.Commands.ValidatorBase;

namespace CondominioSaaSAngular.Application.Features.Auth.Commands.Update;

public class UpdateCommandValidatorAuthUser : CommandValidatorBaseAuthUser<UpdateCommandAuthUser>
{
    public UpdateCommandValidatorAuthUser()
    {
        ConfigureCommonRules();
    }
}