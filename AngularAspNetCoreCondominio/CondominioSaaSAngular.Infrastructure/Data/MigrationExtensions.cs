using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

public static class MigrationExtensions
{
    private const int MaxMigrationRetries = 5;
    private static readonly TimeSpan MigrationRetryDelay = TimeSpan.FromSeconds(15);

    public static async Task ApplyMigrationsWithRetryAsync(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILoggerFactory>()
                     .CreateLogger("DatabaseMigration");

        for (int attempt = 1; attempt <= MaxMigrationRetries; attempt++)
        {
            try
            {
                logger.LogInformation("Aplicando migrations/seed (tentativa {Attempt}/{MaxRetries})...", attempt, MaxMigrationRetries);
                await app.MigrateAndSeedDatabaseAsync();
                logger.LogInformation("Migrations aplicadas e seed concluído.");
                break;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Falha ao aplicar migrations/seed na tentativa {Attempt}.", attempt);

                if (attempt == MaxMigrationRetries)
                {
                    logger.LogCritical("Não foi possível aplicar migrations/seed após {MaxRetries} tentativas.", MaxMigrationRetries);
                    throw;
                }

                await Task.Delay(MigrationRetryDelay);
            }
        }
    }
}
