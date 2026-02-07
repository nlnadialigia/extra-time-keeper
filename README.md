# 🕐 Extra Time Keeper

Sistema de controle de horas extras e compensações desenvolvido com Next.js, Prisma e PostgreSQL.

## 🚀 Tecnologias

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL + Prisma 7
- **Autenticação:** NextAuth v4
- **UI:** Shadcn/UI + Tailwind CSS
- **Tabela:** AG-Grid Community
- **PDF:** @react-pdf/renderer
- **Gerenciador de Pacotes:** pnpm

## 📋 Pré-requisitos

- Node.js 18+
- pnpm
- Docker e Docker Compose (para PostgreSQL)

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone <seu-repositorio>
cd extra-time-keeper
```

2. **Instale as dependências:**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
- `DATABASE_URL`: URL de conexão do PostgreSQL
- `NEXTAUTH_SECRET`: Chave secreta (gere com `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` (opcional, para OAuth)

4. **Inicie o banco de dados:**
```bash
docker-compose up -d
```

5. **Execute as migrações:**
```bash
npx prisma migrate dev --name init
```

6. **Gere o Prisma Client:**
```bash
npx prisma generate
```

## 🏃 Executando o Projeto

### Desenvolvimento
```bash
pnpm dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Build de Produção
```bash
pnpm build
pnpm start
```

## 📊 Funcionalidades

- ✅ **Autenticação**
  - Login com email/senha
  - Login com Google (OAuth)
  - Cadastro de novos usuários
  - Validação de senha forte
  - Sessões seguras com NextAuth

- ✅ **Gestão de Horas**
  - Registro de horas extras
  - Registro de compensações
  - Cálculo automático de saldo
  - Visualização em tabela interativa (AG-Grid)

- ✅ **Exportação**
  - Geração de relatórios em PDF
  - Download direto do navegador

## 🗂️ Estrutura do Projeto

```
extra-time-keeper/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── app/
│   │   ├── actions/           # Server Actions
│   │   ├── api/auth/          # NextAuth API routes
│   │   ├── dashboard/         # Página do dashboard
│   │   ├── layout.tsx         # Layout raiz
│   │   └── page.tsx           # Página de login
│   ├── components/
│   │   ├── overtime/          # Componentes de horas extras
│   │   └── ui/                # Componentes Shadcn/UI
│   └── lib/
│       ├── auth.ts            # Configuração NextAuth
│       └── db.ts              # Cliente Prisma
├── docs/ay/                   # Documentação adicional
├── docker-compose.yml         # Configuração PostgreSQL
└── prisma.config.ts           # Configuração Prisma 7
```

## 🔐 Autenticação

O sistema utiliza NextAuth v4 com dois provedores:

1. **Credentials:** Email e senha armazenados no banco
2. **Google OAuth:** Login social (requer configuração)

## 🗄️ Banco de Dados

### Modelos Principais

- **User:** Usuários do sistema
- **TimeEntry:** Registros de horas (extras e compensações)
- **Account/Session:** Gerenciamento de autenticação

### Comandos Úteis

```bash
# Visualizar banco de dados
npx prisma studio

# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Reset do banco (CUIDADO!)
npx prisma migrate reset
```

## 📝 Scripts Disponíveis

```bash
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Build de produção
pnpm start        # Inicia servidor de produção
pnpm lint         # Executa linter
```

## 🚧 Próximos Passos

Consulte o arquivo [docs/ay/proximos-passos.md](docs/ay/proximos-passos.md) para ver as funcionalidades planejadas.

## 📄 Licença

Este projeto é privado e de uso interno.

---

Desenvolvido com ❤️ usando Next.js e Prisma
