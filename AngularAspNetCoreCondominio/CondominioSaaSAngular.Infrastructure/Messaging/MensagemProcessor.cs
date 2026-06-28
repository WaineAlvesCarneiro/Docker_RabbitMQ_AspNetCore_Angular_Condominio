using CondominioSaaSAngular.Domain.Interfaces;
using CondominioSaaSAngular.Infrastructure.Messaging.Configurations;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace CondominioSaaSAngular.Infrastructure.Messaging;

public class MensagemProcessor(ILogger logger, IServiceProvider serviceProvider, IOptions<RabbitMqSettings> settings)
{
    private readonly ILogger _logger = logger;
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly RabbitMqSettings _settings = settings.Value;

    private int MaxRetryCount => _settings.MaxRetryCount;
    private const int DefaultRetryCount = 0;

    public async Task ProcessarAsync(IChannel channel, BasicDeliverEventArgs ea)
    {
        var content = Encoding.UTF8.GetString(ea.Body.ToArray());
        var emailData = DesserializarEmail(content);

        if (!ValidarEmailData(emailData))
        {
            await NackAsync(channel, ea.DeliveryTag, "Dados de e-mail inválidos. Movendo para DLQ.", LogLevel.Warning);
            return;
        }

        var sucesso = await EnviarEmailAsync(emailData!);

        if (sucesso) await channel.BasicAckAsync(ea.DeliveryTag, false);
        else await TratarReTentativaAsync(channel, ea, content);
    }

    private static EnvioEmailRequest? DesserializarEmail(string content)
    {
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        return JsonSerializer.Deserialize<EnvioEmailRequest>(content, options);
    }

    private static bool ValidarEmailData(EnvioEmailRequest? emailData) =>
        emailData != null && !string.IsNullOrEmpty(emailData.Para) && emailData.EmpresaId != decimal.Zero;

    private async Task<bool> EnviarEmailAsync(EnvioEmailRequest emailData)
    {
        using var scope = _serviceProvider.CreateScope();
        var emailSender = scope.ServiceProvider.GetRequiredService<IEmailSenderService>();

        _logger.LogInformation("[Worker] Processando e-mail para: {Destino}", emailData.Para);

        return await emailSender.EnviarSmtpAsync(
            emailData.Para, emailData.Assunto, emailData.Corpo, emailData.EmpresaId);
    }

    private async Task TratarReTentativaAsync(IChannel channel, BasicDeliverEventArgs ea, string content)
    {
        if (string.IsNullOrEmpty(content) || content.Contains("\"empresaId\":0"))
        {
            await NackAsync(channel, ea.DeliveryTag, "Mensagem inválida detectada. Descartando para DLQ.", LogLevel.Error);
            return;
        }

        var retryCount = ObterRetryCount(ea.BasicProperties.Headers!);

        if (retryCount < MaxRetryCount)
            await NackAsync(channel, ea.DeliveryTag, $"Falha no envio. Tentativa {retryCount + 1}. Re-enfileirando via DLX...", LogLevel.Warning);
        else
            await NackAsync(channel, ea.DeliveryTag, "Limite de tentativas atingido. Removendo da fila principal.", LogLevel.Error);
    }

    private static long ObterRetryCount(IDictionary<string, object>? headers)
    {
        if (headers != null && headers.TryGetValue("x-death", out var xDeath))
            return (xDeath as IList<object>)?.Count ?? DefaultRetryCount;

        return DefaultRetryCount;
    }

    private async Task NackAsync(IChannel channel, ulong deliveryTag, string logMessage, LogLevel level)
    {
        _logger.Log(level, "[Worker] {Message} | DeliveryTag={DeliveryTag}", logMessage, deliveryTag);
        await channel.BasicNackAsync(deliveryTag, false, requeue: false);
    }
}
