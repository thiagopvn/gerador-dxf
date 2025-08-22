'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Plus, Edit2, Trash2, Shield, CheckCircle, XCircle, Building2, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import ModalWrapper from '@/components/layout/ModalWrapper';
import { auth } from '@/lib/firebase';

interface Model {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  active: boolean;
  createdAt?: Date;
}

interface Brand {
  id: string;
  name: string;
  active: boolean;
}

interface AuthUser {
  uid: string;
  email: string | null;
  role: string;
}

export default function AdminModels() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<Model[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [formData, setFormData] = useState({ id: '', name: '', brandId: '', active: true });
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
                await Promise.all([loadModels(), loadBrands()]);
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

  const loadModels = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/models', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setModels(data.models.sort((a: Model, b: Model) => a.name.localeCompare(b.name)));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao carregar modelos');
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
      setError('Erro ao carregar modelos');
    }
  };

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
        setBrands(data.brands.filter((b: Brand) => b.active).sort((a: Brand, b: Brand) => a.name.localeCompare(b.name)));
      } else {
        const errorData = await response.json();
        console.error('Erro ao carregar marcas:', errorData.error);
      }
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    }
  };

  const handleCreateModel = async () => {
    setActionLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const selectedBrand = brands.find(b => b.id === formData.brandId);
      if (!selectedBrand) {
        setError('Marca selecionada não encontrada');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          brandName: selectedBrand.name
        })
      });

      const data = await response.json();

      if (response.ok) {
        await loadModels();
        setShowModal(false);
        setFormData({ id: '', name: '', brandId: '', active: true });
      } else {
        setError(data.error || 'Erro ao criar modelo');
      }
    } catch {
      setError('Erro ao criar modelo');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateModel = async () => {
    if (!selectedModel) return;
    
    setActionLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const selectedBrand = brands.find(b => b.id === formData.brandId);
      if (!selectedBrand) {
        setError('Marca selecionada não encontrada');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch(`/api/models/${selectedModel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: formData.name, 
          brandId: formData.brandId,
          brandName: selectedBrand.name,
          active: formData.active
        })
      });

      const data = await response.json();

      if (response.ok) {
        await loadModels();
        setShowModal(false);
        setSelectedModel(null);
        setFormData({ id: '', name: '', brandId: '', active: true });
      } else {
        setError(data.error || 'Erro ao atualizar modelo');
      }
    } catch {
      setError('Erro ao atualizar modelo');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteModel = async () => {
    if (!selectedModel) return;
    
    setActionLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch(`/api/models/${selectedModel.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await loadModels();
        setShowModal(false);
        setSelectedModel(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao excluir modelo');
      }
    } catch {
      setError('Erro ao excluir modelo');
    } finally {
      setActionLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalType('create');
    setFormData({ id: '', name: '', brandId: '', active: true });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (model: Model) => {
    setModalType('edit');
    setSelectedModel(model);
    setFormData({ 
      id: model.id, 
      name: model.name, 
      brandId: model.brandId,
      active: model.active 
    });
    setError('');
    setShowModal(true);
  };

  const openDeleteModal = (model: Model) => {
    setModalType('delete');
    setSelectedModel(model);
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
          <p className="text-text-secondary">Carregando gerenciamento de modelos...</p>
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
                <h1 className="text-3xl font-bold text-text-primary">Gerenciar Modelos</h1>
                <p className="text-text-secondary mt-2">Configure os modelos de veículos disponíveis</p>
              </div>
              <Button onClick={openCreateModal} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Novo Modelo
              </Button>
            </div>
          </div>

          {/* Lista de modelos */}
          <Card>
            <CardHeader>
              <CardTitle>Modelos Cadastrados ({models.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {models.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                  <p className="text-text-secondary">Nenhum modelo encontrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-secondary">
                        <th className="text-left py-3 px-4 font-medium text-text-secondary">Modelo</th>
                        <th className="text-left py-3 px-4 font-medium text-text-secondary">Marca</th>
                        <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-text-secondary">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {models.map((model, index) => (
                        <tr key={model.id} className={`border-b border-border-secondary hover:bg-bg-primary transition-colors ${
                          index % 2 === 0 ? 'bg-bg-secondary/30' : ''
                        }`}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center">
                                <Car className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <span className="text-text-primary font-semibold">{model.name}</span>
                                <p className="text-xs text-text-secondary">{model.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-white rounded p-0.5">
                                <img 
                                  src={`/logos/${model.brandId}.png`}
                                  alt={model.brandName}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                  }}
                                />
                                <div className="fallback-icon hidden w-full h-full flex items-center justify-center">
                                  <Building2 className="w-3 h-3 text-text-secondary" />
                                </div>
                              </div>
                              <span className="text-text-primary">{model.brandName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              model.active 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {model.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {model.active ? 'Ativo' : 'Inativo'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditModal(model)}
                                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                                title="Editar modelo"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(model)}
                                className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Excluir modelo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
            modalType === 'create' ? 'Novo Modelo' : 
            modalType === 'edit' ? 'Editar Modelo' : 
            'Excluir Modelo'
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
                      placeholder="ford-ka"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase() })}
                      required
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Identificador único do modelo (letras minúsculas e hífen)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Nome</label>
                    <Input
                      placeholder="Ka"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Marca</label>
                    <Select 
                      value={formData.brandId}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                      required
                    >
                      <option value="">Selecione uma marca</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
                    <Select 
                      value={formData.active ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                      required
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateModel} 
                    disabled={actionLoading || !formData.id || !formData.name || !formData.brandId}
                    className="flex-1"
                  >
                    {actionLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Criando...
                      </>
                    ) : (
                      'Criar Modelo'
                    )}
                  </Button>
                </div>
              </>
            )}

            {modalType === 'edit' && selectedModel && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">ID</label>
                    <Input value={selectedModel.id} disabled className="opacity-60" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Nome</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Marca</label>
                    <Select 
                      value={formData.brandId}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                      required
                    >
                      <option value="">Selecione uma marca</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
                    <Select 
                      value={formData.active ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                      required
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleUpdateModel} 
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

            {modalType === 'delete' && selectedModel && (
              <>
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Excluir modelo
                  </h3>
                  <p className="text-text-secondary">
                    Tem certeza que deseja excluir o modelo <strong>{selectedModel.name}</strong> ({selectedModel.brandName})?<br />
                    Esta ação não pode ser desfeita.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleDeleteModel} 
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