using CondominioSaaSAngular.Application.Features.Empresas.Commands.ValidatorBase;
using CondominioSaaSAngular.Domain.Repositories;

namespace CondominioSaaSAngular.Application.Features.Empresas.Commands.Update;

public class UpdateCommandValidatorEmpresa : CommandValidatorBaseEmpresa<UpdateCommandEmpresa>
{
    public UpdateCommandValidatorEmpresa(IEmpresaRepository repository)
    {
        ConfigureCommonRules(repository);
    }
}