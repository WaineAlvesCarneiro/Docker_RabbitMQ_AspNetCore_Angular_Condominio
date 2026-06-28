using CondominioSaaSAngular.Domain.Common;
using FluentValidation;
using MediatR;

namespace CondominioSaaSAngular.Application.Behaviors;

public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : Result
{
    private readonly IEnumerable<IValidator<TRequest>> _validators = validators;

    private const int DefaultCount = 0;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (!_validators.Any()) return await next(cancellationToken);

        var context = new ValidationContext<TRequest>(request);
        var validationResults = await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationResults
            .Where(r => r.Errors.Count != DefaultCount)
            .SelectMany(r => r.Errors)
            .ToList();

        if (failures.Count != DefaultCount)
        {
            var errors = string.Join(", ", failures.Select(e => e.ErrorMessage));
            return (TResponse)typeof(TResponse)
                .GetMethod("Failure", [typeof(string)])!
                .Invoke(null, [errors])!;
        }

        return await next(cancellationToken);
    }
}