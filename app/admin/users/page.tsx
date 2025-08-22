'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Plus, Edit2, Trash2, Shield, UserCheck, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import ModalWrapper from '@/components/layout/ModalWrapper';
import { auth } from '@/lib/firebase';

interface UserData {
  uid: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface AuthUser {
  uid: string;
  email: string | null;
  role: string;
}

export default function AdminUsers() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
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
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      // Usar Firebase client diretamente
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      })) as UserData[];

      setUsers(usersData.sort((a: UserData, b: UserData) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar usuários');
    }
  };

  const handleCreateUser = async () => {
    setActionLoading(true);
    setError('');

    try {
      // Usar a REST API do Firebase Auth diretamente
      const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      const SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

      const response = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          returnSecureToken: true
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Criar documento do usuário no Firestore
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        
        await setDoc(doc(db, 'users', data.localId), {
          email: formData.email,
          role: formData.role,
          createdAt: new Date(),
          isActive: true
        });

        await loadUsers();
        setShowModal(false);
        setFormData({ email: '', password: '', role: 'user' });
      } else {
        let errorMessage = 'Erro ao criar usuário';
        if (data.error?.message === 'EMAIL_EXISTS') {
          errorMessage = 'Este email já está em uso';
        } else if (data.error?.message === 'INVALID_EMAIL') {
          errorMessage = 'Email inválido';
        } else if (data.error?.message === 'WEAK_PASSWORD') {
          errorMessage = 'Senha muito fraca';
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
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
      // Atualizar documento do usuário no Firestore
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      await updateDoc(doc(db, 'users', selectedUser.uid), {
        role: formData.role,
        updatedAt: new Date()
      });

      await loadUsers();
      setShowModal(false);
      setSelectedUser(null);
      setFormData({ email: '', password: '', role: 'user' });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
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
      // Marcar usuário como inativo ao invés de deletar completamente
      // (Deletar usuários do Firebase Auth requer privilégios admin especiais)
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      await updateDoc(doc(db, 'users', selectedUser.uid), {
        isActive: false,
        deletedAt: new Date()
      });

      await loadUsers();
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
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

  const openEditModal = (userToEdit: UserData) => {
    setModalType('edit');
    setSelectedUser(userToEdit);
    setFormData({ email: userToEdit.email, password: '', role: userToEdit.role });
    setError('');
    setShowModal(true);
  };

  const openDeleteModal = (userToDelete: UserData) => {
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header da página */}
          <div className="flex flex-col gap-4">
            <Button 
              variant="secondary" 
              onClick={() => router.push('/admin')}
              className="w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Painel
            </Button>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Gerenciar Usuários</h1>
                <p className="text-text-secondary mt-2">Administre as contas de usuário do sistema</p>
              </div>
              <Button onClick={openCreateModal} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </div>

          {/* Lista de usuários */}
          <Card>
            <CardHeader>
              <CardTitle>Usuários Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
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
                      {users.map((userData, index) => (
                        <tr key={userData.uid} className={`border-b border-border-secondary hover:bg-bg-primary transition-colors ${
                          index % 2 === 0 ? 'bg-bg-secondary/30' : ''
                        }`}>
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
            </CardContent>
          </Card>
        </div>
      </main>

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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                      <Input
                        type="email"
                        placeholder="usuario@exemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Senha</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Tipo de usuário</label>
                      <Select 
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                      >
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleCreateUser} 
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      {actionLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Criando...
                        </>
                      ) : (
                        'Criar Usuário'
                      )}
                    </Button>
                  </div>
                </>
              )}

              {modalType === 'edit' && selectedUser && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                      <Input value={selectedUser.email} disabled className="opacity-60" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Tipo de usuário</label>
                      <Select 
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                      >
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleUpdateUser} 
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      {actionLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Salvando...
                        </>
                      ) : (
                        'Salvar Alterações'
                      )}
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
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleDeleteUser} 
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {actionLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Excluindo...
                        </>
                      ) : (
                        'Sim, Excluir'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </ModalWrapper>
        )}
    </div>
  );
}