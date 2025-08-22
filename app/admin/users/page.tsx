'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Plus, Edit2, Trash2, Shield, UserCheck } from 'lucide-react';
import Header from '@/components/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/layout/Card';
import { FormField, Input, Button, Select } from '@/components/layout/FormField';
import ModalWrapper from '@/components/layout/ModalWrapper';

interface User {
  uid: string;
  email: string;
  role: string;
  createdAt: Date;
}

export default function AdminUsers() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth');
        const { doc, getDoc } = await import('firebase/firestore');
        const { auth, db } = await import('@/lib/firebase');
        
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const userRole = userData.role || 'user';
              
              if (userRole === 'admin') {
                setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  role: userRole
                });
                await loadUsers();
              } else {
                router.push('/dashboard');
                return;
              }
            } else {
              router.push('/dashboard');
              return;
            }
            setLoading(false);
          } else {
            router.push('/login');
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const loadUsers = async () => {
    try {
      // Usando API de demonstração (trocar por /api/users em produção)
      const response = await fetch('/api/users/demo');

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users.sort((a: User, b: User) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } else {
        setError('Erro ao carregar usuários');
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar usuários');
    }
  };

  const handleCreateUser = async () => {
    setActionLoading(true);
    setError('');

    try {
      // Usando API de demonstração (trocar por /api/users em produção)
      const response = await fetch('/api/users/demo', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        await loadUsers();
        setShowModal(false);
        setFormData({ email: '', password: '', role: 'user' });
      } else {
        setError(data.error || 'Erro ao criar usuário');
      }
    } catch (error) {
      setError('Erro ao criar usuário');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    setActionLoading(true);
    setError('');

    try {
      // Usando API de demonstração (trocar por /api/users/${selectedUser.uid} em produção)
      const response = await fetch(`/api/users/demo/${selectedUser.uid}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: formData.role })
      });

      const data = await response.json();

      if (response.ok) {
        await loadUsers();
        setShowModal(false);
        setSelectedUser(null);
        setFormData({ email: '', password: '', role: 'user' });
      } else {
        setError(data.error || 'Erro ao atualizar usuário');
      }
    } catch (error) {
      setError('Erro ao atualizar usuário');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setActionLoading(true);
    setError('');

    try {
      // Usando API de demonstração (trocar por /api/users/${selectedUser.uid} em produção)
      const response = await fetch(`/api/users/demo/${selectedUser.uid}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        await loadUsers();
        setShowModal(false);
        setSelectedUser(null);
      } else {
        setError(data.error || 'Erro ao excluir usuário');
      }
    } catch (error) {
      setError('Erro ao excluir usuário');
    } finally {
      setActionLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalType('create');
    setFormData({ email: '', password: '', role: 'user' });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (userToEdit: User) => {
    setModalType('edit');
    setSelectedUser(userToEdit);
    setFormData({ email: userToEdit.email, password: '', role: userToEdit.role });
    setError('');
    setShowModal(true);
  };

  const openDeleteModal = (userToDelete: User) => {
    setModalType('delete');
    setSelectedUser(userToDelete);
    setError('');
    setShowModal(true);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <p className="text-text-secondary">Carregando gerenciamento de usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header user={user} />
      <PageWrapper>
        <div className="space-y-6">
          {/* Header da página */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Gerenciar Usuários</h1>
              <p className="text-text-secondary mt-2">Administre as contas de usuário do sistema</p>
            </div>
            <Button onClick={openCreateModal} className="!w-auto">
              <Plus className="w-4 h-4" />
              Novo Usuário
            </Button>
          </div>

          {/* Lista de usuários */}
          <Card>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">Usuários Cadastrados</h2>
              
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                  <p className="text-text-secondary">Nenhum usuário encontrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-secondary">
                        <th className="text-left py-3 px-4 font-medium text-text-secondary">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-text-secondary">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-text-secondary">Criado em</th>
                        <th className="text-right py-3 px-4 font-medium text-text-secondary">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userData) => (
                        <tr key={userData.uid} className="border-b border-border-secondary hover:bg-bg-primary">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-text-primary">{userData.email}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              userData.role === 'admin' 
                                ? 'bg-accent-red/20 text-accent-red' 
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {userData.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                              {userData.role === 'admin' ? 'Administrador' : 'Usuário'}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-text-secondary">
                            {new Date(userData.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditModal(userData)}
                                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                                title="Editar usuário"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {userData.uid !== user.uid && (
                                <button
                                  onClick={() => openDeleteModal(userData)}
                                  className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Excluir usuário"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Modal */}
        {showModal && (
          <ModalWrapper 
            isOpen={showModal} 
            onClose={() => setShowModal(false)} 
            title={
              modalType === 'create' ? 'Novo Usuário' : 
              modalType === 'edit' ? 'Editar Usuário' : 
              'Excluir Usuário'
            }
          >
            <div className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {modalType === 'create' && (
                <>
                  <FormField label="Email" required>
                    <Input
                      type="email"
                      placeholder="usuario@exemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </FormField>

                  <FormField label="Senha" required>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </FormField>

                  <FormField label="Tipo de usuário" required>
                    <Select 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    >
                      <option value="user">Usuário</option>
                      <option value="admin">Administrador</option>
                    </Select>
                  </FormField>

                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateUser} loading={actionLoading} fullWidth>
                      Criar Usuário
                    </Button>
                  </div>
                </>
              )}

              {modalType === 'edit' && selectedUser && (
                <>
                  <FormField label="Email">
                    <Input value={selectedUser.email} disabled />
                  </FormField>

                  <FormField label="Tipo de usuário" required>
                    <Select 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    >
                      <option value="user">Usuário</option>
                      <option value="admin">Administrador</option>
                    </Select>
                  </FormField>

                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdateUser} loading={actionLoading} fullWidth>
                      Salvar Alterações
                    </Button>
                  </div>
                </>
              )}

              {modalType === 'delete' && selectedUser && (
                <>
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      Excluir usuário
                    </h3>
                    <p className="text-text-secondary">
                      Tem certeza que deseja excluir o usuário <strong>{selectedUser.email}</strong>?<br />
                      Esta ação não pode ser desfeita.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
                      Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser} loading={actionLoading} fullWidth>
                      Sim, Excluir
                    </Button>
                  </div>
                </>
              )}
            </div>
          </ModalWrapper>
        )}
      </PageWrapper>
    </div>
  );
}