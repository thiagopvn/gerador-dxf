'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, Car, Type, LogOut, Menu, X, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { brands } from '@/data/brands';
import { models } from '@/data/models';
import { fontMappings } from '@/data/fontMappings';

interface User {
  uid: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminPanelProps {
  user?: any;
}

export default function AdminPanel({ user }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'brands' | 'models' | 'fonts'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const mockUsers: User[] = [
      {
        uid: 'admin-123',
        email: 'admin@remarcacao.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        uid: 'user-456',
        email: 'user@example.com',
        role: 'user',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        uid: 'user-789',
        email: 'maria.silva@example.com',
        role: 'user',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
    
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    router.push('/');
  };

  const tabs = [
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'brands', label: 'Marcas', icon: Building2 },
    { id: 'models', label: 'Modelos', icon: Car },
    { id: 'fonts', label: 'Fontes', icon: Type },
  ];

  const renderUsers = () => (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Gerenciar Usuários</h2>
        <p className="text-muted">Visualize e gerencie todos os usuários do sistema</p>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-card-hover border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Usuário</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Função</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Data de Criação</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user, index) => (
                  <tr key={user.uid} className="hover:bg-card-hover/50 transition-colors animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-foreground font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'bg-success/10 text-success border border-success/20'
                      }`}>
                        <Shield className="w-3 h-3" />
                        {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-6">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBrands = () => (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Gerenciar Marcas</h2>
        <p className="text-muted">Configure as marcas de veículos disponíveis no sistema</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand, index) => (
          <Card key={brand.id} interactive className="group animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Building2 className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-muted">ID: {brand.id}</p>
                  </div>
                </div>
                {brand.active ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <XCircle className="w-5 h-5 text-error" />
                )}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted">Ordem: {brand.order}</span>
                <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-white">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Gerenciar Modelos</h2>
        <p className="text-muted">Configure os modelos de veículos disponíveis no sistema</p>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-card-hover border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Modelo</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Marca</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {models.slice(0, 10).map((model, index) => (
                  <tr key={model.id} className="hover:bg-card-hover/50 transition-colors animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Car className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-foreground font-medium">{model.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted">{model.brandName}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        model.active 
                          ? 'bg-success/10 text-success border border-success/20' 
                          : 'bg-error/10 text-error border border-error/20'
                      }`}>
                        {model.active ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Inativo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFonts = () => (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mapeamentos de Fonte</h2>
        <p className="text-muted">Configure as fontes utilizadas para cada modelo e período</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fontMappings.slice(0, 6).map((mapping, index) => (
          <Card key={mapping.id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{mapping.modelName}</h3>
                  <p className="text-sm text-muted mt-1">
                    Período: {mapping.yearStart} - {mapping.yearEnd}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Type className="w-5 h-5 text-primary" />
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Fonte:</span>
                  <code className="text-foreground bg-card-hover px-2 py-1 rounded text-xs font-mono">
                    {mapping.fontFileName}
                  </code>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Tamanho:</span>
                  <span className="text-foreground font-medium">{mapping.settings.fontSize}px</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Espaçamento:</span>
                  <span className="text-foreground font-medium">{mapping.settings.spacing || 0}</span>
                </div>
              </div>
              
              <Button variant="secondary" size="sm" fullWidth className="mt-4">
                Configurar Fonte
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-red rounded-2xl flex items-center justify-center animate-pulse glow-red">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Carregando Painel</h2>
            <p className="text-muted">Preparando o ambiente administrativo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden bg-card/90 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-card-hover rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-red rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-foreground">Painel Admin</h1>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} icon={<LogOut className="w-4 h-4" />}>
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-0
          w-72 bg-card border-r border-border
          transform transition-transform duration-300 lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 space-y-6 h-full flex flex-col">
            {/* Desktop Header */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-red rounded-xl flex items-center justify-center glow-red">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
                  <p className="text-sm text-muted">Sistema de Gestão</p>
                </div>
              </div>
              {user && (
                <div className="p-3 bg-card-hover rounded-lg">
                  <p className="text-sm font-medium text-foreground">{user.email}</p>
                  <p className="text-xs text-muted">Administrador do Sistema</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider px-2 mb-4">
                Navegação
              </p>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg
                      text-left transition-all duration-200 group
                      ${activeTab === tab.id
                        ? 'bg-gradient-red text-white shadow-lg glow-red'
                        : 'text-muted hover:text-foreground hover:bg-card-hover'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop Logout */}
            <div className="hidden lg:block pt-6 border-t border-border">
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={handleLogout}
                icon={<LogOut className="w-4 h-4" />}
              >
                Sair do Sistema
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'brands' && renderBrands()}
            {activeTab === 'models' && renderModels()}
            {activeTab === 'fonts' && renderFonts()}
          </div>
        </main>
      </div>
    </div>
  );
}