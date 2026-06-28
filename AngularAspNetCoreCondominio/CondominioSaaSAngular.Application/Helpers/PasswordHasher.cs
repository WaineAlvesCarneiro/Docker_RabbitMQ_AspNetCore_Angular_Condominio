using BCrypt.Net;

namespace CondominioSaaSAngular.Application.Helpers;

public static class PasswordHasher
{
    private const int IntWorkFactor = 12;
    private const int IntTamanho = 8;

    public static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, IntWorkFactor);
    }

    public static bool VerifyPassword(string password, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }

    public static string GerarSenhaAleatoria(int tamanho = IntTamanho)
    {
        const string caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = new Random();
        return new string([.. Enumerable.Repeat(caracteres, tamanho).Select(s => s[random.Next(s.Length)])]);
    }
}