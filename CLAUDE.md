Este documento é o guia oficial e a "fonte da verdade" para o desenvolvimento da plataforma DXF Generator. Siga estas diretrizes rigorosamente para garantir consistência, qualidade e uma arquitetura robusta.
1. 🏛️ Princípios Fundamentais
Serverless First: A aplicação deve ser 100% serverless. Toda a lógica de backend reside em Next.js API Routes. Não há lugar para Express.js, servidores customizados ou bancos de dados baseados em arquivo como SQLite.
Component-Driven UI: A interface deve ser construída a partir de um sistema de componentes reutilizáveis localizados em /components/ui e /components/layout. Evite estilização customizada por página; em vez disso, crie ou estenda componentes base.
Design System é Lei: O Design System (cores, tipografia, espaçamento) definido neste documento deve ser seguido em toda a aplicação para garantir consistência visual e profissionalismo.
Segurança em Primeiro Lugar: Toda rota de API deve validar o token JWT do usuário e verificar suas permissões (roles) antes de executar qualquer lógica.
2. 🚀 Quick Start e Comandos
Configuração Inicial
Instalar Dependências: npm install
Configurar Ambiente: Renomeie .env.example para .env.local e preencha as credenciais do Firebase.
Popular Banco de Dados: Execute npm run db:seed para sincronizar os dados de /data com o Firestore.
Criar Admin: Execute npm run db:admin para criar o usuário administrador inicial.
Iniciar Desenvolvimento: npm run dev
Comandos Principais
code
Bash
# Inicia o servidor de desenvolvimento
npm run dev

# Compila a aplicação para produção
npm run build

# Popula o Firestore com dados de /data
npm run db:seed

# Cria o usuário administrador padrão
npm run db:admin
3. 🎨 Design System e Arquitetura de UI
Esta seção define a identidade visual e a estrutura dos componentes da interface.
Paleta de Cores (Tailwind CSS)
Use estas variáveis de cor diretamente nas suas classes do Tailwind.
Backgrounds:
bg-background: Preto principal (#111111)
bg-card: Preto para cards/elementos elevados (#1a1a1a)
Textos:
text-foreground: Branco principal (#ffffff)
text-muted: Cinza para textos secundários (#a0a0a0)
Destaques (Accent):
bg-primary / text-primary: Vermelho vibrante (#E50914)
hover:bg-primary-hover: Vermelho mais escuro para hover (#f40612)
Bordas:
border-border: Cinza sutil para bordas (#2a2a2a)
Componentes de UI Base (/components/ui/)
Button.tsx
Propósito: Botão de ação principal.
Variantes:
variant='primary': Fundo vermelho, texto branco. Para ações primárias (Ex: Entrar, Gerar DXF).
variant='secondary': Fundo transparente, borda sutil. Para ações secundárias (Ex: Cancelar).
Estados: Deve incluir estados loading (com spinner) e disabled.
Card.tsx
Propósito: Contêiner principal para agrupar conteúdo.
Estilo: Fundo bg-card, borda border-border, cantos arredondados (rounded-lg), padding consistente (p-6).
Input.tsx, Select.tsx
Propósito: Campos de formulário padronizados.
Estilo: Fundo bg-background, borda border-border, texto text-foreground.
Interação: A borda deve mudar para a cor primary no estado :focus.
ModalWrapper.tsx
Propósito: Estrutura para todos os modais da aplicação.
Funcionalidade: Fundo com overlay, centralizado, scroll interno para conteúdo longo, fecha com a tecla ESC ou clique no overlay.
Componentes de Layout (/components/layout/)
Header.tsx
Propósito: Cabeçalho global da aplicação, exibido após o login.
Conteúdo: Logo, nome do usuário logado, e botão de logout.
PageWrapper.tsx
Propósito: Envolve o conteúdo de cada página para garantir consistência.
Estilo: Adiciona padding vertical e horizontal e limita a largura máxima do conteúdo (max-w-7xl mx-auto).
4. 📁 Estrutura de Pastas e Arquivos
code
Code
/
├── app/
│   ├── api/                  # API Routes (Serverless Functions)
│   ├── admin/                # Páginas do Painel Admin
│   ├── dashboard/            # Página do fluxo do usuário
│   ├── login/                # Página de autenticação
│   └── page.tsx              # Landing Page
│
├── components/
│   ├── ui/                   # Componentes atômicos (Button, Card, Input)
│   ├── layout/               # Componentes de estrutura (Header, PageWrapper)
│   └── (feature-specific)/   # Componentes complexos (BrandSelection, AdminPanel)
│
├── lib/
│   ├── firebase.ts           # Configuração do Firebase Client SDK
│   ├── firebase-admin.ts     # Configuração do Firebase Admin SDK
│   └── types.ts              # Definições de tipos TypeScript
│
├── data/                     # Fonte da verdade para dados estáticos
│   ├── brands.ts
│   ├── models.ts
│   └── fontMappings.ts
│
├── public/
│   ├── fonts/                # Arquivos de fonte .ttf/.otf
│   └── logos/                # Logos das marcas .png/.svg
│
└── scripts/
    ├── create-admin.js
    └── seed-database.js
5. 🔐 Fluxo de Autenticação (Stateless JWT)
Login: O usuário se autentica na página /login usando o Firebase Auth SDK no cliente.
Token: O SDK do Firebase gerencia o ID Token (JWT) do usuário.
Requisições de API: Todas as chamadas para a API (/app/api/*) devem incluir o token no cabeçalho Authorization: Bearer <token>.
Verificação no Backend: Cada API Route deve usar o Firebase Admin SDK para verificar o token e extrair o uid e os customClaims (como a role) do usuário antes de prosseguir.
6. ✨ Implementação de Funcionalidades Chave
Geração de DXF (/app/api/generate-dxf/route.ts)
O endpoint deve ser POST.
Ele deve receber { modelId, year, chassisNumber, engineNumber }.
A lógica deve buscar o fontMapping no Firestore, carregar o arquivo de fonte de /public/fonts/, usar opentype.js para converter o texto em caminhos vetoriais, e usar dxf-writer para gerar o arquivo final com entidades POLYLINE.
CRUD de Usuários (/app/admin/users/page.tsx)
O administrador deve poder ver uma lista de todos os usuários.
O administrador deve poder criar novos usuários (email, senha, role) através de um modal.
O administrador deve poder editar a role de um usuário existente.
O administrador deve poder deletar um usuário (com um modal de confirmação).
7. 🚨 Padrões Críticos de Desenvolvimento
'use client': Adicione esta diretiva no topo de qualquer arquivo que use hooks do React (useState, useEffect, etc.) ou manipule eventos do navegador.
Carregamento de Estado: Use telas de carregamento (skeletons ou spinners) enquanto os dados são buscados do Firestore para evitar layout shifts e melhorar a UX.
Tratamento de Erros: Exiba mensagens de erro claras e amigáveis para o usuário, tanto em formulários quanto em chamadas de API.
Consistência: Sempre utilize os componentes de UI (Button, Card, etc.) em vez de criar elementos estilizados do zero. Isso é fundamental para a manutenção e consistência visual.
126,2s
#foque sempre em manter serverless para deploy no vercel
#exclua sempre as pastas que não forem permitir um serverless