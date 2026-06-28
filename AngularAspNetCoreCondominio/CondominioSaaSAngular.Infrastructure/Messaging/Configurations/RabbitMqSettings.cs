namespace CondominioSaaSAngular.Infrastructure.Messaging.Configurations;

public class RabbitMqSettings
{
    public string Host { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string QueueName { get; init; } = "fila_emails_angular";
    public string ExchangeName { get; init; } = "email_exchange_angular";
    public string DeadLetterExchange { get; init; } = "dlx_exchange_angular";
    public string DeadLetterQueue { get; init; } = "fila_emails_erro_angular";
    public int Port { get; init; } = 5672;
    public int MaxRetryCount { get; set; } = 3;
    public int DefaultRetryCount { get; set; } = 0;

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(Host))
            throw new ArgumentException("RabbitMQ Host não configurado.");
        if (string.IsNullOrWhiteSpace(UserName))
            throw new ArgumentException("RabbitMQ UserName não configurado.");
        if (string.IsNullOrWhiteSpace(Password))
            throw new ArgumentException("RabbitMQ Password não configurado.");
        if (string.IsNullOrWhiteSpace(ExchangeName))
            throw new ArgumentException("RabbitMQ ExchangeName não configurado.");
    }

    public override string ToString()
    {
        return $"Host: {Host}, Port: {Port}, User: {UserName}, Queue: {QueueName}, Exchange: {ExchangeName}";
    }
}
