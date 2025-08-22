'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Edit2, Trash2, Shield, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import ModalWrapper from '@/components/layout/ModalWrapper';
import { auth } from '@/lib/firebase';

interface Brand {
  id: string;
  name: string;
  active: boolean;
  order: number;
  createdAt?: Date;
}

interface AuthUser {
  uid: string;
  email: string | null;
  role: string;
}

export default function AdminBrands() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ id: '', name: '', active: true, order: 1 });
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
                await loadBrands();
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

  const loadBrands = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/brands', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands.sort((a: Brand, b: Brand) => a.order - b.order));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao carregar marcas');
      }
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
      setError('Erro ao carregar marcas');
    }
  };

  const handleCreateBrand = async () => {
    setActionLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        await loadBrands();
        setShowModal(false);
        setFormData({ id: '', name: '', active: true, order: 1 });
      } else {
        setError(data.error || 'Erro ao criar marca');
      }
    } catch {
      setError('Erro ao criar marca');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateBrand = async () => {
    if (!selectedBrand) return;
    
    setActionLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch(`/api/brands/${selectedBrand.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: formData.name, 
          active: formData.active, 
          order: formData.order 
        })
      });

      const data = await response.json();

      if (response.ok) {
        await loadBrands();
        setShowModal(false);
        setSelectedBrand(null);
        setFormData({ id: '', name: '', active: true, order: 1 });
      } else {
        setError(data.error || 'Erro ao atualizar marca');
      }
    } catch {
      setError('Erro ao atualizar marca');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;
    
    setActionLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch(`/api/brands/${selectedBrand.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await loadBrands();
        setShowModal(false);
        setSelectedBrand(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao excluir marca');
      }
    } catch {
      setError('Erro ao excluir marca');
    } finally {
      setActionLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalType('create');
    const nextOrder = Math.max(...brands.map(b => b.order), 0) + 1;
    setFormData({ id: '', name: '', active: true, order: nextOrder });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (brand: Brand) => {
    setModalType('edit');
    setSelectedBrand(brand);
    setFormData({ 
      id: brand.id, 
      name: brand.name, 
      active: brand.active, 
      order: brand.order 
    });
    setError('');
    setShowModal(true);
  };

  const openDeleteModal = (brand: Brand) => {
    setModalType('delete');
    setSelectedBrand(brand);
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
          <p className="text-text-secondary">Carregando gerenciamento de marcas...</p>
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
                <h1 className="text-3xl font-bold text-text-primary">Gerenciar Marcas</h1>
                <p className="text-text-secondary mt-2">Configure as marcas de veículos disponíveis</p>
              </div>
              <Button onClick={openCreateModal} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Nova Marca
              </Button>
            </div>
          </div>

          {/* Grid de marcas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Card key={brand.id}>
                <CardContent>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-sm">
                        <img 
                          src={`/logos/${brand.id}.png`}
                          alt={`Logo ${brand.name}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                          }}
                        />
                        <div className="fallback-icon hidden w-full h-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-text-secondary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{brand.name}</h3>
                        <p className="text-xs text-text-secondary">#{brand.order}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {brand.active ? (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          <CheckCircle className="w-3 h-3" />
                          Ativa
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded">
                          <XCircle className="w-3 h-3" />
                          Inativa
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(brand)}
                      className="flex-1 p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                      title="Editar marca"
                    >
                      <Edit2 className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(brand)}
                      className="flex-1 p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Excluir marca"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <ModalWrapper 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          title={
            modalType === 'create' ? 'Nova Marca' : 
            modalType === 'edit' ? 'Editar Marca' : 
            'Excluir Marca'
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
                    <label className="block text-sm font-medium text-text-primary mb-2">ID</label>
                    <Input
                      placeholder="ford"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase() })}
                      required
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Usado para identificar a marca (deve corresponder ao nome do arquivo do logo)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Nome</label>
                    <Input
                      placeholder="Ford"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
                      <Select 
                        value={formData.active ? 'active' : 'inactive'}
                        onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                        required
                      >
                        <option value="active">Ativa</option>
                        <option value="inactive">Inativa</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Ordem</label>
                      <Input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateBrand} 
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    {actionLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Criando...
                      </>
                    ) : (
                      'Criar Marca'
                    )}
                  </Button>
                </div>
              </>
            )}

            {modalType === 'edit' && selectedBrand && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">ID</label>
                    <Input value={selectedBrand.id} disabled className="opacity-60" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Nome</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
                      <Select 
                        value={formData.active ? 'active' : 'inactive'}
                        onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                        required
                      >
                        <option value="active">Ativa</option>
                        <option value="inactive">Inativa</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Ordem</label>
                      <Input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleUpdateBrand} 
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

            {modalType === 'delete' && selectedBrand && (
              <>
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Excluir marca
                  </h3>
                  <p className="text-text-secondary">
                    Tem certeza que deseja excluir a marca <strong>{selectedBrand.name}</strong>?<br />
                    Esta ação não pode ser desfeita.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleDeleteBrand} 
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