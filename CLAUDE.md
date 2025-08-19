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
   - Copie o arquivo `.env.local` (já configurado)
   - As credenciais do Firebase já estão configuradas

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

## 🏗️ Arquitetura

### Stack Tecnológica
- **Framework:** Next.js 14 com App Router
- **Linguagem:** TypeScript  
- **Estilização:** Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **Banco de Dados:** Firebase Firestore
- **Autenticação:** Firebase Authentication
- **Geração DXF:** dxf-writer + opentype.js

### Estrutura de Pastas
```
app/
├── api/              # API Routes
├── admin/            # Painel administrativo
├── dashboard/        # Dashboard do usuário
├── login/            # Tela de login
├── layout.tsx        # Layout global
└── page.tsx          # Página inicial

components/           # Componentes React
├── AdminPanel.tsx
├── BrandSelection.tsx
├── ModelSelection.tsx
├── DXFGeneration.tsx
└── Header.tsx

lib/                 # Utilitários
├── firebase.ts      # Config Firebase client
├── firebase-admin.ts # Config Firebase admin
└── types.ts         # Tipos TypeScript

data/                # Dados estáticos
├── brands.ts
├── models.ts
└── fontMappings.ts

scripts/             # Scripts utilitários
├── create-admin.js
└── seed-database.js
```

## 👤 Usuários Padrão

### Administrador
- **Email:** admin@remarcacao.com
- **Senha:** Admin@2024!
- **Acesso:** /admin

### Usuário Teste
Crie usuários através do painel administrativo ou Firebase Console.

## 🔧 Funcionalidades

### Dashboard do Usuário
1. **Seleção de Marca:** Grid com logos das marcas
2. **Seleção de Modelo:** Lista dos modelos disponíveis  
3. **Geração DXF:** Formulário com ano, chassi e motor

### Painel Administrativo
- Visualização de usuários
- Gerenciamento de marcas e modelos
- Configuração de mapeamentos de fonte
- Dados somente leitura

### API de Geração DXF
- Endpoint: `/api/generate-dxf`
- Autenticação via JWT token
- Vetorização de texto usando OpenType.js
- Conversão de curvas Bézier para polylines
- Download automático do arquivo DXF

## 🌐 Deploy na Vercel

1. **Conectar repositório Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [seu-repositorio]
   git push -u origin main
   ```

2. **Configurar na Vercel:**
   - Importe o projeto do GitHub
   - Configure as variáveis de ambiente
   - Deploy automático

## 🎨 Design System

### Cores (Tailwind)
- **Background Primary:** `#111111`
- **Background Secondary:** `#1a1a1a`
- **Border:** `#2a2a2a`
- **Text Primary:** `#ffffff`
- **Text Secondary:** `#a0a0a0`
- **Accent Red:** `#E50914`
- **Success:** `#10b981`
- **Error:** `#ef4444`

### Componentes CSS
- `.btn-primary`: Botão principal vermelho
- `.input-field`: Campo de entrada estilizado
- `.card`: Card com background escuro

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

## 🚨 Troubleshooting

### Erro de autenticação
- Verifique as credenciais no `.env.local`
- Certifique-se de que o usuário admin foi criado

### Erro na geração DXF
- Verifique se as fontes estão em `public/fonts/`
- Confirme se existe mapeamento para o modelo/ano

### Problemas de build
- Execute `npm run type-check` para verificar tipos
- Verifique se todas as dependências estão instaladas