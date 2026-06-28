# As telas ainda estou trabalhando no CSS

# 🏢 Projeto de Gerenciamento de Condomínios (Multitenant)

Sistema robusto e escalável projetado para arquitetura em Nuvem (**Cloud Native**) com suporte a múltiplos condomínios (**Multi-tenant**), onde cada condomínio é isolado estruturalmente como uma empresa distinta.

O ecossistema é composto por:
- **Backend** em ASP.NET Core 8 (DDD, CQRS, MediatR, EF Core)
- **Frontend** em angular com rotas protegidas e autenticação JWT
- **Worker Service** acoplado ao **RabbitMQ** para envio assíncrono de e-mails transacionais
- **SQL Server** rodando em container
- **Swagger/OpenAPI** para documentação automatizada

---

## 🏗️ Arquitetura e Tecnologias Utilizadas

- [ASP.NET Core 8](https://dotnet.microsoft.com/)  
- [Angular](https://angular.dev/)  
- [RabbitMQ](https://www.rabbitmq.com/)  
- [SQL Server 2022](https://www.microsoft.com/sql-server)  
- [Docker](https://www.docker.com/)  

---

## 🚀 Guia de Execução do Projeto

Este projeto foi containerizado com **Docker Compose**.  
Siga os passos abaixo para rodar localmente:

---

## 🔧 Pré-requisitos

- Docker e Docker Desktop instalados
- Containers externos já rodando para:
  - **SQL Server 2022** (`sqlserver2022`)
  - **RabbitMQ** (`rabbitmq`)
- Ambos conectados à rede Docker `infra_net`

---

## 📥 Passo a Passo
Bash
```bash
git clone https://github.com/WaineAlvesCarneiro/Docker_RabbitMQ_AspNetCore_Angular_Condominio.git
cd Docker_RabbitMQ_AspNetCore_Angular_Condominio
docker-compose up --build -d
```

#### 📌 Observação: O Worker Service e o Frontend em Angular não iniciam automaticamente via Docker Compose. 

---

## 🔗 Portas e Endereços Disponíveis

| Serviço             | URL de Acesso                                | Credenciais                          |
|---------------------|-----------------------------------------------|--------------------------------------|
| **Frontend (Angular)**| http://localhost:4200/login                 | Admin / 12345                        |
| **Backend (Swagger)**| http://localhost:5004/swagger/index.html     | Livre acesso                         |
| **RabbitMQ Painel** | http://localhost:15672                        | guest / guest                        |
| **SQL Server**      | localhost,1433                                | sa / Senh@ForteCondominio2026!      |

---

## 📌 Observações Importantes

- O **SQL Server** e o **RabbitMQ** **não são criados neste compose**.  
    Eles já devem estar rodando em containers externos e conectados à rede `infra_net`.  
- O `docker-compose.yml` deste projeto apenas sobe API, Worker e Frontend Angular, que consomem os serviços externos.
- O healthcheck da API está configurado para aguardar até que o SQL Server esteja pronto antes de marcar o container como saudável.

---

## 🔐 Fluxo de Autenticação

- Login inicial com usuário **Admin / 12345**
- Sistema exige redefinição de senha no primeiro acesso
- Perfis disponíveis: **Suporte (Admin Global), Síndico e Porteiro**

---

## 📧 Fluxo da Mensageria (RabbitMQ + Worker)

- API publica eventos no exchange `email_exchange_angular`
- Fila principal: `fila_emails_angular`
- Dead Letter Exchange: `dlx_exchange_angular`
- Dead Letter Queue: `fila_emails_erro_angular`
- Worker consome mensagens e envia e-mails transacionais

---
## 🗄️ Banco de Dados

SQL Server já existente em container externo:
- **Host:** `sqlserver2022` (na rede `infra_net`)  
- **Porta:** 1433  
- **Usuário:** sa  
- **Senha:** Senh@ForteCondominio2026!

---

## 👉 Variáveis de Ambiente Essenciais
Essas variáveis já estão configuradas no `docker-compose.yml`.  
Se você for rodar o projeto em outro ambiente (Azure, AWS, etc.), configure-as manualmente:

- ConnectionStrings__ApplicationDbContext
- Jwt__Key, Jwt__Issuer, Jwt__Audience
- RabbitMq__Host, RabbitMq__Port, RabbitMq__UserName, RabbitMq__Password
- RabbitMq__ExchangeName, RabbitMq__QueueName, RabbitMq__DeadLetterExchange, RabbitMq__DeadLetterQueue
- AdminSettings__UserName, AdminSettings__Email, AdminSettings__Password

---

#### Exemplo de auditoria:

SQL
```sql
SELECT * FROM Condominio_aspnet_angular.dbo.AuthUsers
SELECT * FROM Condominio_aspnet_angular.dbo.Empresa
SELECT * FROM Condominio_aspnet_angular.dbo.Imovel
SELECT * FROM Condominio_aspnet_angular.dbo.Morador
```

---

## 📝 Fluxo de Cadastro Inicial

Para que o sistema funcione corretamente, siga esta ordem de cadastro:
1. **Cadastrar uma Empresa**  
   - Representa o condomínio.
2. **Cadastrar Usuários e vincular à empresa**  
   - Um usuário com perfil **Síndico**  
   - Um usuário com perfil **Porteiro**  
   - *(Roles obrigatórias: "Sindico", "Porteiro")*
3. **Cadastrar Imóveis**  
   - Um ou mais imóveis vinculados à empresa.
4. **Cadastrar Moradores**  
   - Vincular cada morador ao imóvel respectivo.

---

## 👨‍💻 Desenvolvedor

### Criado com dedicação por **Waine Alves Carneiro**

#### 🔗 Perfil no GitHub

👉 [GitHub Waine Alves Carneiro](https://github.com/WaineAlvesCarneiro?tab=repositories)
