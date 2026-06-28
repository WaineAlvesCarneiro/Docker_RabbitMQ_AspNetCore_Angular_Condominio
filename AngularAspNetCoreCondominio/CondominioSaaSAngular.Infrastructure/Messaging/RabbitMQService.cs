using CondominioSaaSAngular.Domain.Interfaces;
using CondominioSaaSAngular.Infrastructure.Messaging.Configurations;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace CondominioSaaSAngular.Infrastructure.Messaging;

public class RabbitMQService : IMensageriaService, IDisposable
{
    private readonly ConnectionFactory _factory;
    private readonly RabbitMqSettings _settings;
    private readonly ILogger<RabbitMQService> _logger;

    private IConnection? _connection;
    private IChannel? _channel;

    private readonly SemaphoreSlim _connectionLock = new(1, 1);

    public RabbitMQService(
        IOptions<RabbitMqSettings> settings,
        ILogger<RabbitMQService> logger)
    {
        _logger = logger;
        _settings = settings.Value;

        _factory = new ConnectionFactory()
        {
            HostName = _settings.Host,
            UserName = _settings.UserName,
            Password = _settings.Password,
            AutomaticRecoveryEnabled = true
        };
    }

    public async Task PublicarMensagemAsync<T>(T mensagem) where T : class
    {
        try
        {
            var channel = await GetChannelAsync();

            byte[] body = GerarBodyComStringJson(mensagem);

            var properties = new BasicProperties
            {
                DeliveryMode = DeliveryModes.Persistent
            };

            await GerarBasicPublish(channel, body, properties);

            _logger.LogInformation("[RabbitMQ] Mensagem {Tipo} enviada para {Fila}", typeof(T).Name, _settings.QueueName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[RabbitMQ] Falha crítica ao publicar mensagem do tipo {Tipo}", typeof(T).Name);
            throw;
        }
    }

    private static byte[] GerarBodyComStringJson<T>(T mensagem) where T : class
    {
        var json = JsonSerializer.Serialize(mensagem, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        });

        var body = Encoding.UTF8.GetBytes(json);
        return body;
    }

    private async Task GerarBasicPublish(IChannel channel, byte[] body, BasicProperties properties)
    {
        await channel.BasicPublishAsync(
            exchange: string.Empty,
            routingKey: _settings.QueueName,
            mandatory: true,
            basicProperties: properties,
            body: body);
    }

    private async Task<IChannel> GetChannelAsync()
    {
        if (_channel is { IsOpen: true }) return _channel;

        await _connectionLock.WaitAsync();

        try
        {
            if (_channel is { IsOpen: true }) return _channel;

            _logger.LogInformation("Estabelecendo nova conexão com RabbitMQ em {Host}...", _settings.Host);

            _connection = await _factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            await GerarQueueDeclare();

            return _channel;
        }
        finally
        {
            _connectionLock.Release();
        }
    }

    private async Task GerarQueueDeclare()
    {
        await _channel!.QueueDeclareAsync(
            queue: _settings.QueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: new Dictionary<string, object?>
                {
                        { "x-dead-letter-exchange", _settings.DeadLetterExchange },
                        { "x-dead-letter-routing-key", _settings.QueueName }
                });
    }

    public void Dispose()
    {
        _channel?.CloseAsync().GetAwaiter().GetResult();
        _connection?.CloseAsync().GetAwaiter().GetResult();
        _channel?.Dispose();
        _connection?.Dispose();
        _connectionLock.Dispose();
        GC.SuppressFinalize(this);
    }
}