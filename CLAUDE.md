# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Remarcação de Chassi - DXF Generator

Plataforma de geração de arquivos DXF para remarcação de chassi desenvolvida com Next.js, Firebase e TypeScript.

## 🚀 Comandos Principais

### Desenvolvimento
```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Build da aplicação para produção  
npm run start        # Inicia o servidor em modo produção
npm run lint         # Verifica código com ESLint
npm run type-check   # Verifica tipos TypeScript
```

### Scripts de Banco de Dados
```bash
npm run db:seed      # Popula o banco com dados iniciais
npm run db:admin     # Cria usuário administrador
```

## 📋 Configuração Inicial

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   - O arquivo `.env.local` já está configurado com credenciais do Firebase
   - As credenciais são funcionais para desenvolvimento e produção

3. **Popular o banco de dados:**
   ```bash
   npm run db:seed
   npm run db:admin
   ```

4. **Adicionar fontes:**
   - Coloque os arquivos de fonte (.ttf/.otf) na pasta `public/fonts/`
   - Fontes necessárias: arial.ttf, helvetica.ttf, times.ttf, calibri.ttf, etc.

5. **Adicionar logos das marcas:**
   - Coloque os logos das marcas na pasta `public/logos/`
   - Formato: ford.png, chevrolet.png, volkswagen.png, etc.

## 🏗️ Arquitetura e Fluxo de Dados

### Stack Tecnológica
- **Framework:** Next.js 14 com App Router
- **Linguagem:** TypeScript  
- **Estilização:** Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **Banco de Dados:** Firebase Firestore
- **Autenticação:** Firebase Authentication
- **Geração DXF:** dxf-writer + opentype.js

### Fluxo de Autenticação
1. **Login:** Firebase Auth com verificação de roles via custom claims
2. **Redirecionamento:** Admin users → `/admin`, Regular users → `/dashboard`  
3. **Proteção:** Todas as rotas protegidas verificam auth state
4. **API Security:** JWT tokens validados em todas as API routes

### Sistema de Dados
- **Brands** (`data/brands.ts`): Definição estática das marcas com logos
- **Models** (`data/models.ts`): Modelos vinculados às marcas
- **FontMappings** (`data/fontMappings.ts`): Mapeamentos de fonte por modelo/ano
- **Firebase Sync**: Scripts populam Firestore com dados estáticos

### Geração DXF
- **Endpoint:** `/api/generate-dxf` (POST)
- **Input:** `{ modelId, year, chassisNumber, engineNumber }`
- **Processo:** 
  1. Valida JWT token
  2. Busca mapeamento de fonte por modelo/ano
  3. Gera DXF com texto vetorizado
  4. Retorna arquivo para download
- **Fallback:** DXF simples sem vetorização (para build/deploy)

## 👤 Usuários Padrão

### Administrador
- **Email:** admin@remarcacao.com
- **Senha:** Admin@2024!
- **Acesso:** /admin

### Usuário Teste
Crie usuários através do painel administrativo ou Firebase Console.

## 🎨 Design System

### Cores (Tailwind)
- **Background Primary:** `#111111` (bg-bg-primary)
- **Background Secondary:** `#1a1a1a` (bg-bg-secondary)
- **Border:** `#2a2a2a` (border-border-secondary)
- **Text Primary:** `#ffffff` (text-text-primary)
- **Text Secondary:** `#a0a0a0` (text-text-secondary)
- **Accent Red:** `#E50914` (accent-red)
- **Accent Hover:** `#f40612` (accent-hover)

### Componentes CSS (globals.css)
- `.btn-primary`: Botão principal vermelho
- `.input-field`: Campo de entrada estilizado
- `.card`: Card com background escuro

### Padrões de Interação
- **Hover Effects:** `hover:scale-105 transform transition-all duration-200`
- **Border Highlights:** `hover:border-accent-red`
- **Loading States:** `disabled:opacity-50 disabled:cursor-not-allowed`

## 📝 Desenvolvimento

### Adicionar Nova Marca
1. Adicione em `data/brands.ts`
2. Coloque o logo em `public/logos/`
3. Execute `npm run db:seed`

### Adicionar Novo Modelo  
1. Adicione em `data/models.ts`
2. Execute `npm run db:seed`

### Configurar Nova Fonte
1. Adicione a fonte em `public/fonts/`
2. Configure em `data/fontMappings.ts`
3. Execute `npm run db:seed`

### Estrutura de Componentes
```
components/
├── Header.tsx           # Header com auth e navegação
├── BrandSelection.tsx   # Grid de seleção de marcas
├── ModelSelection.tsx   # Lista de modelos filtrada
├── DXFGeneration.tsx    # Formulário final de geração
└── AdminPanel.tsx       # Painel administrativo
```

### Tipos TypeScript (lib/types.ts)
- **User**: Interface de usuário com roles
- **Brand**: Marca com logo e ordenação
- **Model**: Modelo vinculado à marca
- **FontMapping**: Mapeamento de fonte por modelo/ano/configurações
- **DXFGenerationRequest**: Payload para geração DXF

## 🌐 Deploy na Vercel

A aplicação está otimizada para deploy na Vercel:

1. **Build Optimization**: 
   - `export const dynamic = 'force-dynamic'` em páginas que usam auth
   - Fallback para DXF simples durante build
   - Componentes client-side marcados com `'use client'`

2. **Environment Variables na Vercel:**
   - Configure todas as variáveis do `.env.local`
   - Firebase funciona tanto em dev quanto em produção

## 🚨 Troubleshooting

### Erro de build na Vercel
- Verifique se todos os componentes client estão marcados com `'use client'`
- Confirme que páginas com auth têm `export const dynamic = 'force-dynamic'`

### Erro na geração DXF
- Verifique se as fontes estão em `public/fonts/`
- Confirme se existe mapeamento para o modelo/ano
- API retorna DXF simples como fallback

### Problemas de autenticação
- Verifique as credenciais no `.env.local`
- Certifique-se de que o usuário admin foi criado com `npm run db:admin`
- Firebase rules permitem leitura/escrita para usuários autenticados

### Problemas de estilo
- Tailwind está configurado para usar tema customizado
- Classes customizadas definidas em `globals.css`
- Use `bg-bg-primary`, `text-text-primary`, `accent-red`, etc.