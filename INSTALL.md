# Guia de Instalação

## Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

#### Para Desenvolvimento Local (SQLite)

O arquivo `prisma/schema.prisma` já está configurado para SQLite. Configure o `.env`:

```env
DATABASE_URL="file:./dev.db"
```

#### Para Produção (PostgreSQL)

Antes de fazer deploy no Vercel:

1. Crie um banco PostgreSQL (recomendamos Supabase, Neon ou Railway)
2. Copie o conteúdo de `prisma/schema.postgresql.prisma` para `prisma/schema.prisma`
3. Configure a variável `DATABASE_URL` no Vercel com a connection string do PostgreSQL

### 3. Gerar Prisma Client e Criar Tabelas

```bash
npx prisma generate
npx prisma db push
```

### 4. Criar Ícones PWA (Opcional)

Crie imagens de 192x192 e 512x512 pixels e salve em:
- `public/icon-192x192.png`
- `public/icon-512x512.png`

Ou use um gerador online como https://realfavicongenerator.net/

### 5. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

### 6. Deploy no Vercel

1. Faça push do código para GitHub/GitLab
2. Conecte o repositório no Vercel
3. Configure a variável de ambiente `DATABASE_URL`
4. O Vercel fará o build automaticamente
5. Após o deploy, execute `npx prisma db push` para criar as tabelas

## Funcionalidades

✅ **Despesas Fixas**: Cadastre aluguel, luz, água e internet
✅ **Mercado**: Cadastre compras com itens detalhados
✅ **Comparação de Preços**: Veja a variação de preços de itens entre meses
✅ **QR Code**: Gere e leia QR codes para automatizar cadastros
✅ **Dashboard**: Visualize gráficos e relatórios dos seus gastos
✅ **PWA**: Instale no celular como aplicativo

## Estrutura do Projeto

- `app/` - Páginas e rotas Next.js
- `app/api/` - APIs REST
- `prisma/` - Schema do banco de dados
- `lib/` - Utilitários e configurações
- `public/` - Arquivos estáticos (ícones PWA)

