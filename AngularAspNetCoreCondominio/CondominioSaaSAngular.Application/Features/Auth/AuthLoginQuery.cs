using CondominioSaaSAngular.Domain.Entities.Auth;
using MediatR;

namespace CondominioSaaSAngular.Application.Features.Auth;

public class AuthLoginQuery : IRequest<AuthUser>
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}