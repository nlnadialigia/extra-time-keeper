# 🔐 Credenciais de Acesso

## Usuário Administrador

Para acessar o painel administrativo, use as seguintes credenciais:

- **Email:** `admin@example.com`
- **Senha:** `admin123`

## Como Acessar

1. Faça login no sistema com as credenciais acima
2. Você será redirecionado automaticamente para o painel administrativo (`/admin`)

## Funcionalidades do Admin

- ✅ Visualizar todos os usuários do sistema
- ✅ Ver estatísticas de cada usuário (horas extras, compensações, saldo)
- ✅ Expandir detalhes de um usuário para ver todas as suas movimentações
- ✅ Exportar relatório em PDF de cada usuário individualmente
- ✅ Controle de acesso baseado em roles

## Diferenças do Usuário Normal

- **Dashboard:** Admin não tem acesso ao dashboard normal, apenas ao painel administrativo
- **Registros:** Admin não registra horas extras próprias
- **Visualização:** Admin visualiza dados de todos os usuários do sistema
- **Exportação:** Admin pode exportar relatórios de qualquer usuário (exceto outros admins)

## Executar Seed

Para recriar o usuário admin, execute:

```bash
pnpm seed
```

## Notas de Segurança

⚠️ **IMPORTANTE**: Altere a senha padrão em produção!

1. Faça login como admin
2. Vá em "Perfil" 
3. Altere a senha para uma senha segura
