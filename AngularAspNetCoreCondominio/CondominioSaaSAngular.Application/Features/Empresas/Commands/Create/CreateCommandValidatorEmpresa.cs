using CondominioSaaSAngular.Application.Features.Empresas.Commands.ValidatorBase;
using CondominioSaaSAngular.Domain.Repositories;

namespace CondominioSaaSAngular.Application.Features.Empresas.Commands.Create;

public class CreateCommandValidatorEmpresa : CommandValidatorBaseEmpresa<CreateCommandEmpresa>
{
    public CreateCommandValidatorEmpresa(IEmpresaRepository repository)
    {
        ConfigureCommonRules(repository);
    }
}