# AutoParts - Plataforma E-Commerce de Peças Automóveis

Uma plataforma completa de e-commerce para venda de peças automóveis, construída com **Next.js 16**, **TypeScript**, **Tailwind CSS** e **Supabase**.

## 🚀 Funcionalidades

- 🔍 **Pesquisa Inteligente**: Por matrícula, veículo (Marca/Modelo/Motor) e N.º de Chassis/VIN
- 🛒 **Carrinho de Compras**: Com drawer lateral e gestão de quantidades
- 🚗 **Garagem Pessoal**: Guarde múltiplos veículos e filtre peças compatíveis com 1-clique
- 💳 **Checkout Português**: MB WAY, Multibanco e Cartão de Crédito
- 📦 **Gestão de Encomendas**: Histórico com código de rastreio CTT
- 📍 **Moradas de Entrega**: Guardar múltiplas moradas com preenchimento automático no checkout
- 🔐 **Autenticação**: Login e registo com sessão persistente
- 🗄️ **Supabase**: Base de dados PostgreSQL cloud com Supabase

## 🛠️ Tecnologias

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL)
- **Lucide React** (ícones)
- **Cloudflare Pages** (Hosting & Edge Deployment)

## ⚙️ Instalação

```bash
# Clonar o repositório
git clone https://github.com/parceriasezi-hub/autoparts.git
cd autoparts/web

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.local.example .env.local
# Editar .env.local com as suas credenciais Supabase
```

## 🔑 Variáveis de Ambiente

Crie um ficheiro `.env.local` na pasta `web/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

## 🗄️ Configuração da Base de Dados

Execute o ficheiro `supabase/schema.sql` no **SQL Editor** do painel Supabase para criar as tabelas e políticas RLS.

Para popular os dados iniciais:

```bash
node scripts/seedSupabase.mjs
```

## 💻 Desenvolvimento

```bash
npm run dev
# Abrir http://localhost:3000
```

## 🏗️ Build

```bash
npm run build
```

## ☁️ Deploy no Cloudflare Pages

### Método 1: Integração Automática GitHub (Recomendado)

1. Aceda ao [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Selecione o repositório `parceriasezi-hub/autoparts`.
3. Configure os parâmetros do projeto:
   - **Project Name**: `autoparts`
   - **Production branch**: `main`
   - **Framework preset**: `Next.js` (ou `None`)
   - **Root directory**: `web`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next` (ou `out` em caso de export estático)
4. Em **Environment variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`: O URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: A sua chave anónima Supabase
5. Clique em **Save and Deploy**.

### Método 2: Deploy manual via Direct Upload / CLI

```bash
cd web
npx wrangler pages deploy .next --project-name=autoparts
```
