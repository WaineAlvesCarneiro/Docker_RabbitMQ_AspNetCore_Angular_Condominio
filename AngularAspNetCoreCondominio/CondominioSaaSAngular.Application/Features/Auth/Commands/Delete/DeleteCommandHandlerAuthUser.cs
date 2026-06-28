using CondominioSaaSAngular.Domain.Common;
using CondominioSaaSAngular.Domain.Repositories.Auth;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Auth.Commands.Delete;

public class DeleteCommandHandlerAuthUser(IAuthUserRepository repository)
    : IRequestHandler<DeleteCommandAuthUser, Result>
{
    public async Task<Result> Handle(DeleteCommandAuthUser request, CancellationToken cancellationToken)
    {
        var dado = await repository.GetByIdAsync(request.Id,cancellationToken);
        if (dado is null) return Result.Failure("Usuário não encontrado.");

        await repository.DeleteAsync(dado);
        return Result.Success("Usuário deletado com sucesso.");
    }
}