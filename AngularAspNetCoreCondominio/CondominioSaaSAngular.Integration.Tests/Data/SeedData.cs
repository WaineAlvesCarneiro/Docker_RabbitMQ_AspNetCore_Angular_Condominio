using CondominioSaaSAngular.Application.Helpers;
using CondominioSaaSAngular.Domain.Entities.Auth;
using CondominioSaaSAngular.Domain.Enums;
using CondominioSaaSAngular.Infrastructure.Data;

namespace CondominioSaaSAngular.Integration.Tests.Data
{
    public static class SeedData
    {
        public static void Initialize(ApplicationDbContext context)
        {
            const string ADMIN_USERNAME = "Admin";
            const string ADMIN_EMAIL = "email@gmail.com";
            const TipoRole ADMIN_ROLE = (TipoRole)1;
            const string ADMIN_PASSWORD = "12345";

            if (!context.AuthUsers.Any(u => u.UserName == ADMIN_USERNAME))
            {
                var admin = new AuthUser
                {
                    UserName = ADMIN_USERNAME,
                    Email = ADMIN_EMAIL,
                    Role = ADMIN_ROLE,
                    PasswordHash = PasswordHasher.HashPassword(ADMIN_PASSWORD)
                };

                context.AuthUsers.Add(admin);
                context.SaveChanges();

                bool ok = PasswordHasher.VerifyPassword(ADMIN_PASSWORD, admin.PasswordHash);
                Console.WriteLine($"Verificação de senha no seed: {ok}");
            }

            Console.WriteLine($"Usuários no banco: {context.AuthUsers.Count()}");
        }
    }
}
