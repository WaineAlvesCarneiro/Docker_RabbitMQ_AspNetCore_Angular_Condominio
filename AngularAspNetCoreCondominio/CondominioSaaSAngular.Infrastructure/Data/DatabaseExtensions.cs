using CondominioSaaSAngular.Application.Mappings;
using CondominioSaaSAngular.Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

public static class DatabaseExtensions
{
    public static async Task MigrateAndSeedDatabaseAsync(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ApplicationDbContext>();
        var logger = services.GetRequiredService<ILoggerFactory>()
                     .CreateLogger("DatabaseMigration");

        await context.Database.MigrateAsync();
        //ou 
        //await context.Database.EnsureCreatedAsync();

        try
        {
            if (!await context.AuthUsers.AnyAsync(u => u.UserName == "Admin"))
            {
                var configuration = services.GetRequiredService<IConfiguration>();
                var adminUser = configuration.ToEntityMigrateAndSeedDatabase();

                if (adminUser != null)
                {
                    context.AuthUsers.Add(adminUser);
                    await context.SaveChangesAsync();
                    logger.LogInformation("Usuário Administrador padrão criado com sucesso!");
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao executar seed do banco de dados.");
        }
    }
}
