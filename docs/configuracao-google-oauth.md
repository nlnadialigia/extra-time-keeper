# Configuração do Google OAuth

Este guia explica como configurar a autenticação com Google no projeto.

## ✅ É Gratuito?

Sim! O Google OAuth é **100% gratuito** para autenticação básica.

- Até 10.000 requisições por dia (gratuito)
- Sem custo para login/cadastro
- Você só paga se usar outros serviços do Google Cloud

## 📋 Passo a Passo

### 1. Acesse o Google Cloud Console

Acesse: https://console.cloud.google.com

### 2. Crie um Projeto

- Clique em "Select a project" no topo
- Clique em "New Project"
- Dê um nome (ex: "Extra Time Keeper")
- Clique em "Create"

### 3. Configure a Tela de Consentimento OAuth

- No menu lateral, vá em: **APIs & Services** > **OAuth consent screen**
- Escolha **External** (para qualquer usuário com conta Google)
- Clique em "Create"
- Preencha:
  - **App name:** Extra Time Keeper
  - **User support email:** seu email
  - **Developer contact:** seu email
- Clique em "Save and Continue"
- Em "Scopes", clique em "Save and Continue" (não precisa adicionar nada)
- Em "Test users", adicione seu email (opcional)
- Clique em "Save and Continue"

### 4. Crie as Credenciais OAuth 2.0

- No menu lateral, vá em: **APIs & Services** > **Credentials**
- Clique em "Create Credentials" > "OAuth client ID"
- Escolha **Web application**
- Preencha:
  - **Name:** Extra Time Keeper Web Client
  - **Authorized JavaScript origins:**
    - `http://localhost:3000` (desenvolvimento)
    - `https://seu-dominio.com` (produção)
  - **Authorized redirect URIs:**
    - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
    - `https://seu-dominio.com/api/auth/callback/google` (produção)
- Clique em "Create"

### 5. Copie as Credenciais

Após criar, você verá uma tela com:
- **Client ID:** algo como `123456789-abc.apps.googleusercontent.com`
- **Client Secret:** algo como `GOCSPX-abc123def456`

**Copie esses valores!**

### 6. Configure o Arquivo `.env`

Adicione as credenciais no arquivo `.env` na raiz do projeto:

```env
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
```

### 7. Reinicie o Servidor

```bash
pnpm dev
```

## ✅ Pronto!

Agora o botão "Continuar com Google" está funcionando nas páginas de login e registro.

## 🔒 Segurança

- **Nunca** commite o arquivo `.env` no Git
- O `.env` já está no `.gitignore`
- Em produção, configure as variáveis de ambiente no seu serviço de hospedagem

## 🚀 Produção

Quando for para produção:

1. Volte nas credenciais do Google Cloud Console
2. Adicione a URL de produção nos "Authorized redirect URIs"
3. Configure as variáveis de ambiente no seu servidor/plataforma
4. Publique a aplicação na tela de consentimento OAuth (sair do modo "Testing")

## 📚 Referências

- [Google Cloud Console](https://console.cloud.google.com)
- [NextAuth.js - Google Provider](https://next-auth.js.org/providers/google)
