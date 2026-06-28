using CondominioSaaSAngular.Integration.Tests.Commons;
using System.Net;
using System.Net.Http.Json;

namespace CondominioSaaSAngular.Integration.Tests.Features.Auth;

public record AuthLoginRequest(string Username, string Password);

public class AuthIntegrationTests : BaseIntegrationTest
{
    public AuthIntegrationTests(CustomWebApplicationFactory<Program> factory) : base(factory) { }

    [Fact]
    public async Task Post_Senha_Incorreta_Deve_Retornar_Falha_De_Autorizacao()
    {
        var loginRequest = new AuthLoginRequest("Admin", "senhaErrada123");
        var response = await _client.PostAsJsonAsync("/Auth/login", loginRequest);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Post_Usuario_Inexistente_Deve_Retornar_Falha_De_Autorizacao()
    {
        var loginRequest = new AuthLoginRequest("usuario.inexistente", "12345");
        var response = await _client.PostAsJsonAsync("/Auth/login", loginRequest);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
