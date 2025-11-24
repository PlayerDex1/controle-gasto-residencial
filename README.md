# Controle de Gastos Residencial

Sistema completo para controle de gastos residenciais com suporte a:
- Despesas fixas (Aluguel, Luz, Água, Internet)
- Mercado com detalhamento de itens
- Comparação de preços entre meses
- Sistema de QR Code para automatização
- PWA para uso como aplicativo mobile

## Tecnologias

- Next.js 14
- TypeScript
- Prisma (SQLite)
- Tailwind CSS
- PWA

## Instalação

```bash
npm install
```

## Configuração do Banco de Dados

### Desenvolvimento Local (SQLite)

Para desenvolvimento local, você pode usar SQLite. Edite `prisma/schema.prisma` e altere o provider para `sqlite`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

E configure o `.env`:
```
DATABASE_URL="file:./dev.db"
```

### Produção (Vercel - PostgreSQL)

Para produção no Vercel, use PostgreSQL. Configure a variável de ambiente `DATABASE_URL` no Vercel com a URL do seu banco PostgreSQL.

```bash
npx prisma generate
npx prisma db push
```

## Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Deploy no Vercel

1. Faça push do código para um repositório Git (GitHub, GitLab, etc.)
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente:
   - `DATABASE_URL`: URL do seu banco PostgreSQL (você pode usar serviços como Supabase, Neon, ou Railway)
4. O Vercel fará o build e deploy automaticamente
5. Após o deploy, execute `npx prisma db push` para criar as tabelas no banco

### Configuração do PostgreSQL

Recomendamos usar:
- **Supabase** (gratuito): https://supabase.com
- **Neon** (gratuito): https://neon.tech
- **Railway** (gratuito): https://railway.app

Após criar o banco, copie a connection string e configure como `DATABASE_URL` no Vercel.

## Funcionalidades

- ✅ Cadastro de despesas fixas mensais
- ✅ Cadastro de compras de mercado com itens detalhados
- ✅ Comparação de preços de itens entre meses
- ✅ Geração e leitura de QR Codes
- ✅ Dashboard com visualizações
- ✅ PWA para instalação no celular

