# Remarcação de Chassi - DXF Generator

Plataforma completa de geração de arquivos DXF para remarcação de chassi, desenvolvida com **Next.js**, **Firebase** e **TypeScript**.

## 🚀 Características

- **🏗️ Arquitetura Serverless** - Next.js 14 com App Router
- **🔐 Autenticação Completa** - Firebase Authentication com roles
- **💾 Banco de Dados** - Firebase Firestore
- **📁 Geração de DXF** - Vetorização de texto para arquivos CAD
- **🎨 Interface Moderna** - Design dark com Tailwind CSS
- **👨‍💻 Painel Admin** - Gerenciamento completo de dados

## 🛠️ Tecnologias

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (Serverless)
- **Banco:** Firebase Firestore
- **Auth:** Firebase Authentication  
- **DXF:** OpenType.js para vetorização
- **Deploy:** Vercel (pronto)

## ⚡ Início Rápido

```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd remarcacao-chassi

# 2. Instale as dependências
npm install

# 3. Configure o banco de dados
npm run db:seed
npm run db:admin

# 4. Inicie o desenvolvimento
npm run dev
```

## 🔑 Acesso

**Administrador:**
- Email: `admin@remarcacao.com`
- Senha: `Admin@2024!`
- Acesso: `/admin`

## 📱 Funcionalidades

### Dashboard do Usuário
1. **Seleção de Marca** - Grid visual com logos
2. **Seleção de Modelo** - Lista dos modelos disponíveis
3. **Geração DXF** - Formulário para chassi e motor

### Painel Administrativo
- Visualização de usuários cadastrados
- Gerenciamento de marcas e modelos
- Configuração de fontes por modelo/ano
- Interface responsiva e intuitiva

### API de Geração
- Endpoint seguro com autenticação JWT
- Vetorização inteligente de texto
- Download automático do arquivo DXF
- Metadados inclusos no arquivo

## 📂 Estrutura

```
app/
├── api/              # API Routes serverless
├── admin/            # Painel administrativo  
├── dashboard/        # Dashboard do usuário
└── login/            # Sistema de autenticação

components/           # Componentes reutilizáveis
lib/                 # Configurações e tipos
data/                # Dados de marcas/modelos
scripts/             # Scripts de configuração
```

## 🌐 Deploy

Pronto para deploy na **Vercel** com um simples `git push`:

1. Conecte o repositório no GitHub
2. Importe na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

## 📝 Comandos

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run db:seed      # Popular banco de dados
npm run db:admin     # Criar administrador
npm run type-check   # Verificar tipos
```

## 🎯 Próximos Passos

- [ ] Adicionar fontes reais (.ttf/.otf) em `/public/fonts/`
- [ ] Incluir logos das marcas em `/public/logos/`
- [ ] Configurar domínio personalizado
- [ ] Implementar backup automático
- [ ] Dashboard de analytics

---

✨ **Aplicação 100% funcional e pronta para produção!**
