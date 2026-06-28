using CondominioSaaSAngular.Infrastructure.Messaging.Configurations;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace CondominioSaaSAngular.Infrastructure.Messaging;

public class EmailConsumerWorker : BackgroundService
{
    private readonly ILogger<EmailConsumerWorker> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly RabbitMqSettings _settings;
    private readonly ConnectionFactory _factory;

    public EmailConsumerWorker(
        ILogger<EmailConsumerWorker> logger,
        IServiceProvider serviceProvider,
        IOptions<RabbitMqSettings> settings)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _settings = settings.Value;

        _factory = new ConnectionFactory
        {
            HostName = _settings.Host,
            UserName = _settings.UserName,
            Password = _settings.Password,
            Port = _settings.Port,
            AutomaticRecoveryEnabled = true
        };
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("[Worker] Inicializando consumidor de e-mails...");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await using var connection = await _factory.CreateConnectionAsync(stoppingToken);
                await using var channel = await connection.CreateChannelAsync(cancellationToken: stoppingToken);

                await ConfigurarInfraestruturaAsync(channel, stoppingToken);

                var consumer = new AsyncEventingBasicConsumer(channel);
                ConsumerReceivedAsync(channel, consumer);

                await channel.BasicConsumeAsync(_settings.QueueName, autoAck: false, consumer, stoppingToken);

                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[Worker] RabbitMQ offline. Tentando novamente em 10s...");
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }
    }

    private void ConsumerReceivedAsync(IChannel channel, AsyncEventingBasicConsumer consumer)
    {
        consumer.ReceivedAsync += async (_, ea) =>
        {
            try
            {
                var processor = new MensagemProcessor(_logger, _serviceProvider, Options.Create(_settings));
                await processor.ProcessarAsync(channel, ea);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[Worker] Erro crítico na mensagem {DeliveryTag}", ea.DeliveryTag);
                await channel.BasicNackAsync(ea.DeliveryTag, false, requeue: false);
            }
        };
    }

    private async Task ConfigurarInfraestruturaAsync(IChannel channel, CancellationToken token)
    {
        await channel.ExchangeDeclareAsync(_settings.DeadLetterExchange, ExchangeType.Direct, cancellationToken: token);
        await channel.QueueDeclareAsync(_settings.DeadLetterQueue, durable: true, exclusive: false, autoDelete: false, cancellationToken: token);
        await channel.QueueBindAsync(_settings.DeadLetterQueue, _settings.DeadLetterExchange, _settings.QueueName, cancellationToken: token);

        await channel.ExchangeDeclareAsync(_settings.ExchangeName, ExchangeType.Direct, durable: true, cancellationToken: token);
        await channel.QueueDeclareAsync(_settings.QueueName, durable: true, exclusive: false, autoDelete: false,
            arguments: new Dictionary<string, object?>
            {
                { "x-dead-letter-exchange", _settings.DeadLetterExchange },
                { "x-dead-letter-routing-key", _settings.QueueName }
            }, cancellationToken: token);
        await channel.QueueBindAsync(_settings.QueueName, _settings.ExchangeName, _settings.QueueName, cancellationToken: token);
    }
}
