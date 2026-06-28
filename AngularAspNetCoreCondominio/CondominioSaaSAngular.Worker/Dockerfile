FROM mcr.microsoft.com/dotnet/runtime:8.0 AS base
USER $APP_UID
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["CondominioSaaSAngular.Worker/CondominioSaaSAngular.Worker.csproj", "CondominioSaaSAngular.Worker/"]
COPY ["CondominioSaaSAngular.Domain/CondominioSaaSAngular.Domain.csproj", "CondominioSaaSAngular.Domain/"]
COPY ["CondominioSaaSAngular.Infrastructure/CondominioSaaSAngular.Infrastructure.csproj", "CondominioSaaSAngular.Infrastructure/"]
COPY ["CondominioSaaSAngular.Application/CondominioSaaSAngular.Application.csproj", "CondominioSaaSAngular.Application/"]
RUN dotnet restore "./CondominioSaaSAngular.Worker/CondominioSaaSAngular.Worker.csproj"
COPY . .
WORKDIR "/src/CondominioSaaSAngular.Worker"
RUN dotnet build "./CondominioSaaSAngular.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CondominioSaaSAngular.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CondominioSaaSAngular.Worker.dll"]