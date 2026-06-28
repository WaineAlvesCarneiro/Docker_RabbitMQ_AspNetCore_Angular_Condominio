using CondominioSaaSAngular.Application.DTOs;
using CondominioSaaSAngular.Application.Mappings;
using CondominioSaaSAngular.Domain.Common;
using CondominioSaaSAngular.Domain.Repositories.Auth;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Auth.Queries.GetById;

public class GetByIdQueryHandlerAuthUser(IAuthUserRepository repository)
    : IRequestHandler<GetByIdQueryAuthUser, Result<AuthUserDto>>
{
    public async Task<Result<AuthUserDto>> Handle(GetByIdQueryAuthUser request, CancellationToken cancellationToken)
    {
        var dado = await repository.GetByIdAsync(request.Id, cancellationToken);
        if (dado is null) return Result<AuthUserDto>.Failure("Usuário não encontrado.");

        return Result<AuthUserDto>.Success(dado.ToDto());
    }
}