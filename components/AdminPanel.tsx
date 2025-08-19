'use client';

import { useState, useEffect } from 'react';
import { brands } from '@/data/brands';
import { models } from '@/data/models';
import { fontMappings } from '@/data/fontMappings';

interface User {
  uid: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'users' | 'brands' | 'models' | 'fonts'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
    ];
    
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const tabs = [
    { id: 'users', label: 'Usuários', icon: '👥' },
    { id: 'brands', label: 'Marcas', icon: '🏷️' },
    { id: 'models', label: 'Modelos', icon: '🚗' },
    { id: 'fonts', label: 'Fontes', icon: '📝' },
  ];

  const renderUsers = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Usuários</h2>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left py-3 px-4 text-white font-medium">Email</th>
                <th className="text-left py-3 px-4 text-white font-medium">Role</th>
                <th className="text-left py-3 px-4 text-white font-medium">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} className="border-b border-[#2a2a2a] last:border-b-0">
                  <td className="py-3 px-4 text-[#a0a0a0]">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-[#E50914] text-white' 
                        : 'bg-[#10b981] text-white'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#a0a0a0]">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBrands = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Marcas</h2>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left py-3 px-4 text-white font-medium">Nome</th>
                <th className="text-left py-3 px-4 text-white font-medium">Logo</th>
                <th className="text-left py-3 px-4 text-white font-medium">Status</th>
                <th className="text-left py-3 px-4 text-white font-medium">Ordem</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="border-b border-[#2a2a2a] last:border-b-0">
                  <td className="py-3 px-4 text-white font-medium">{brand.name}</td>
                  <td className="py-3 px-4 text-[#a0a0a0]">{brand.logo}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      brand.active ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white'
                    }`}>
                      {brand.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#a0a0a0]">{brand.order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Modelos</h2>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left py-3 px-4 text-white font-medium">Nome</th>
                <th className="text-left py-3 px-4 text-white font-medium">Marca</th>
                <th className="text-left py-3 px-4 text-white font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id} className="border-b border-[#2a2a2a] last:border-b-0">
                  <td className="py-3 px-4 text-white font-medium">{model.name}</td>
                  <td className="py-3 px-4 text-[#a0a0a0]">{model.brandName}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      model.active ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white'
                    }`}>
                      {model.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFonts = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Mapeamentos de Fonte</h2>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left py-3 px-4 text-white font-medium">Modelo</th>
                <th className="text-left py-3 px-4 text-white font-medium">Fonte</th>
                <th className="text-left py-3 px-4 text-white font-medium">Período</th>
                <th className="text-left py-3 px-4 text-white font-medium">Tamanho</th>
              </tr>
            </thead>
            <tbody>
              {fontMappings.map((mapping) => (
                <tr key={mapping.id} className="border-b border-[#2a2a2a] last:border-b-0">
                  <td className="py-3 px-4 text-white font-medium">{mapping.modelName}</td>
                  <td className="py-3 px-4 text-[#a0a0a0]">{mapping.fontFileName}</td>
                  <td className="py-3 px-4 text-[#a0a0a0]">
                    {mapping.yearStart} - {mapping.yearEnd}
                  </td>
                  <td className="py-3 px-4 text-[#a0a0a0]">{mapping.settings.fontSize}px</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] min-h-screen p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Administração</h2>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#E50914] text-white'
                  : 'text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'brands' && renderBrands()}
        {activeTab === 'models' && renderModels()}
        {activeTab === 'fonts' && renderFonts()}
      </div>
    </div>
  );
}