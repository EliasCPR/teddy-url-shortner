# Sistema de Encurtamento de URL

Este é um sistema de encurtamento de URL que permite aos usuários encurtar URLs de forma simples e eficiente. O sistema oferece funcionalidades adicionais para usuários autenticados, como editar, listar e deletar URLs encurtadas.

## Funcionalidades

- **Usuários não autenticados**:
  - Encurtar URLs.
  
- **Usuários autenticados**:
  - Encurtar URLs.
  - Listar todas as URLs encurtadas.
  - Editar URLs encurtadas.
  - Deletar URLs encurtadas.

## Requisitos

- **Node.js**: 14.x ou superior.
- **NestJS**: Framework backend utilizado para construir a API.
- **Prisma**: ORM utilizado para interagir com o banco de dados.
- **JWT (JSON Web Tokens)**: Para autenticação de usuários.
- **Docker**: Gerenciador de containers usado para subir o banco de dados
- **Yarn**: Gerenciador de pacotes

### Dependências
- `@nestjs/common`
- `@nestjs/core`
- `@nestjs/jwt`
- `@nestjs/swagger`
- `prisma`
- `jsonwebtoken`
- `bcryptjs`
  
### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/EliasCPR/teddy-url-shortner.git
   cd url-shortener
2. Instale as dependências:

   ```bash
   yarn install
3. Configure o banco de dados

- Execute o comando para subir o banco de dados
    ```bash
    docker compose up
- Configure o arquivo `.env` com as credenciais do banco de dados, como o URL do banco de dados PostgreSQ

- Execute o comando para rodar as migrações do Prisma:

    ```bash
    npx prisma migrate dev
4. Inicie o servidor

    ```bash
    yarn start:dev
5. A API estará rodando em http://localhost:3000.

## Acessando a Documentação da API

A documentação da API está disponível em:

    http://localhost:3000/api

A documentação é gerada automaticamente pelo Swagger e permite que você visualize e interaja com os endpoints da API diretamente no navegador.

# Estrutura do Banco de Dados

## Tabela: `users`

| Coluna        | Tipo                 | Descrição                                |
|---------------|----------------------|------------------------------------------|
| `id`          | `uuid`               | Identificador único do usuário (UUID)   |
| `email`       | `varchar(255)`        | E-mail do usuário (único)               |
| `passwordHash`| `varchar(255)`        | Hash da senha do usuário                |
| `createdAt`   | `timestamp with time zone` | Data de criação do usuário              |
| `updatedAt`   | `timestamp with time zone` | Data de atualização do usuário          |
| `deletedAt`   | `timestamp with time zone` | Data de exclusão do usuário (opcional)  |

### Relacionamentos:
- Um usuário pode ter várias URLs (`url`).

---

## Tabela: `urls`

| Coluna        | Tipo                        | Descrição                                |
|---------------|-----------------------------|------------------------------------------|
| `id`          | `uuid`                      | Identificador único da URL (UUID)       |
| `shortCode`   | `varchar(255)`               | Código único para a URL encurtada       |
| `originalUrl` | `varchar(2048)`              | URL original                            |
| `createdAt`   | `timestamp with time zone`   | Data de criação da URL                  |
| `updatedAt`   | `timestamp with time zone`   | Data de atualização da URL              |
| `deletedAt`   | `timestamp with time zone`   | Data de exclusão da URL (opcional)      |
| `userId`      | `uuid`                       | ID do usuário que criou a URL (opcional) |

### Relacionamentos:
- Cada URL pode ter um usuário associado (`user`).
- Uma URL pode ter vários clicks (`click`).

---

## Tabela: `clicks`

| Coluna        | Tipo                        | Descrição                                |
|---------------|-----------------------------|------------------------------------------|
| `id`          | `uuid`                      | Identificador único do click (UUID)     |
| `clickedAt`   | `timestamp with time zone`   | Data e hora do click                    |
| `ipAddress`   | `varchar(45)`                | Endereço IP do usuário (opcional)       |
| `userAgent`   | `varchar(255)`               | User-agent do navegador (opcional)      |
| `urlId`       | `uuid`                       | ID da URL que foi clicada               |

### Relacionamentos:
- Cada click está associado a uma URL (`url`).

---

### Mapeamento de Tabelas no Banco

- **Tabela de URLs**: `urls`
- **Tabela de Usuários**: `users`
- **Tabela de Clicks**: `clicks`
