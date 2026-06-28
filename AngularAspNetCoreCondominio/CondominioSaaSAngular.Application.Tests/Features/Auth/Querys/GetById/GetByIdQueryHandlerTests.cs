using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Features.Auth.Queries.GetById;
using CondominioSaaSAngular.Domain.Entities.Auth;
using CondominioSaaSAngular.Domain.Enums;
using CondominioSaaSAngular.Domain.Repositories.Auth;
using Moq;

namespace CondominioSaaSAngular.Application.Tests.Features.Auth.Querys.GetById;

public class GetByIdQueryHandlerTests
{
    private readonly Mock<IAuthUserRepository> _repoMock;
    private readonly GetByIdQueryHandlerAuthUser _handler;

    private readonly AuthUser _existente = new()
    {
        Id = Guid.Parse("85D257AB-F0FD-F011-8550-A5241967915B"),
        EmpresaId = 1,
        UserName = "Admin",
        Email = "email@gmail.com",
        PasswordHash = "12345",
        Role = (TipoRole)1,
        DataInclusao = DateTime.Now
    };

    public GetByIdQueryHandlerTests()
    {
        _repoMock = new Mock<IAuthUserRepository>();
        _handler = new GetByIdQueryHandlerAuthUser(_repoMock.Object);
    }

    [Fact]
    public async Task Handle_AuthUser_Existente_DeveRetornarSucessoComAuthUserDto()
    {
        var query = new GetByIdQueryAuthUser(Guid.Parse("85D257AB-F0FD-F011-8550-A5241967915B"));
        _repoMock.Setup(repo => repo.GetByIdAsync(Guid.Parse("85D257AB-F0FD-F011-8550-A5241967915B"), It.IsAny<CancellationToken>())).ReturnsAsync(_existente);
        var resultado = await _handler.Handle(query, CancellationToken.None);

        Assert.True(resultado.Sucesso);
        Assert.NotNull(resultado.Dados);

        var dto = resultado.Dados;

        Assert.IsType<AuthUserDto>(dto);
        Assert.Equal(Guid.Parse("85D257AB-F0FD-F011-8550-A5241967915B"), dto.Id);
        Assert.Equal(_existente.UserName, dto.UserName);

        _repoMock.Verify(repo => repo.GetByIdAsync(Guid.Parse("85D257AB-F0FD-F011-8550-A5241967915B"), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_AuthUserInexistente_DeveRetornarFailure()
    {
        var query = new GetByIdQueryAuthUser(Guid.Parse("FFFF57AB-F0FD-F011-8550-A5241967915B"));
        _repoMock.Setup(repo => repo.GetByIdAsync(Guid.Parse("FFFF57AB-F0FD-F011-8550-A5241967915B"), It.IsAny<CancellationToken>())).ReturnsAsync((AuthUser)null!);
        var resultado = await _handler.Handle(query, CancellationToken.None);

        Assert.False(resultado.Sucesso);
        Assert.Equal("Usuário não encontrado.", resultado.Mensagem);
        Assert.Null(resultado.Dados);

        _repoMock.Verify(repo => repo.GetByIdAsync(Guid.Parse("FFFF57AB-F0FD-F011-8550-A5241967915B"), It.IsAny<CancellationToken>()), Times.Once);
    }
}