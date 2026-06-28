using CondominioSaaSAngular.Application.Features.Empresas.Commands.Update;
using CondominioSaaSAngular.Domain.Enums;
using CondominioSaaSAngular.Domain.Repositories;
using FluentValidation.TestHelper;
using Moq;

namespace CondominioSaaSAngular.Application.Tests.Features.Empresas.Commands.Update;

public class UpdateCommandValidatorTests
{
    private readonly Mock<IEmpresaRepository> _repoMock;
    private readonly UpdateCommandValidatorEmpresa _validator;

    public UpdateCommandValidatorTests()
    {
        _repoMock = new Mock<IEmpresaRepository>();
        _repoMock.Setup(repo => repo
            .ExisteCnpjAsync(It.IsAny<string>(), It.IsAny<long>(), default))
                 .ReturnsAsync(false);

        _validator = new UpdateCommandValidatorEmpresa(_repoMock.Object);
    }

    private UpdateCommandEmpresa GetValidCommand()
    {
        return new()
        {
            Id = 1,
            RazaoSocial = "Razão Social",
            Fantasia = "Fantasia",
            Cnpj = "44764428000186",
            TipoDeCondominio = (TipoCondominio)1,
            Nome = "Responsável",
            Celular = "11999999999",
            Telefone = "1133333333",
            Email = "email@gmail.com",
            Senha = "SenhaForte123!",
            Host = "smtp.exemplo.com",
            Porta = 587,
            Cep = "74843140",
            Uf = "SP",
            Cidade = "São Paulo",
            Endereco = "Rua Exemplo, 123",
            Bairro = "Pq Amazônia",
            Complemento = "Complemento",
            DataInclusao = DateTime.Now
        };
    }

    [Fact]
    public async Task Validator_ComandoValido_DevePassarSemErros()
    {
        // Arrange
        UpdateCommandEmpresa command = GetValidCommand();

        // Act
        var resultado = await _validator.TestValidateAsync(command, cancellationToken: TestContext.Current.CancellationToken);

        // Assert
        resultado.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public async Task Validator_RazaoSocialVazia_DeveFalharComMensagemCorreta()
    {
        // Arrange
        string mensagemEsperada = "Razão Social é obrigatória";
        UpdateCommandEmpresa command = GetValidCommand();
        command.RazaoSocial = "";

        // Act
        var resultado = await _validator.TestValidateAsync(command, cancellationToken: TestContext.Current.CancellationToken);

        // Assert
        resultado.ShouldHaveValidationErrorFor(c => c.RazaoSocial)
                 .WithErrorMessage(mensagemEsperada);
    }

    [Fact]
    public async Task Validator_CnpjJaExistente_DeveFalhar()
    {
        // Arrange
        UpdateCommandEmpresa command = GetValidCommand();
        _repoMock.Setup(repo => repo.ExisteCnpjAsync(It.IsAny<string>(), command.Id, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        // Act
        var resultado = await _validator.TestValidateAsync(command, cancellationToken: TestContext.Current.CancellationToken);

        // Assert
        resultado.ShouldHaveValidationErrorFor(c => c.Cnpj)
                 .WithErrorMessage("Este CNPJ já está cadastrado para outra empresa.");
    }
}
