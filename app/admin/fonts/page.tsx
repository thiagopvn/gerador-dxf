'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Type, Plus, Edit2, Trash2, Shield, Building2, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import ModalWrapper from '@/components/layout/ModalWrapper';
import { auth } from '@/lib/firebase';

interface FontMapping {
  id: string;
  modelId: string;
  modelName: string;
  yearStart: number;
  yearEnd: number;
  fontFileName: string;
  settings: {
    fontSize: number;
    spacing?: number;
    [key: string]: unknown;
  };
  createdAt?: Date;
}

interface Model {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  active: boolean;
}

interface AuthUser {
  uid: string;
  email: string | null;
  role: string;
}

export default function AdminFonts() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontMappings, setFontMappings] = useState<FontMapping[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedMapping, setSelectedMapping] = useState<FontMapping | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    modelId: '',
    yearStart: 2000,
    yearEnd: 2024,
    fontFileName: '',
    fontSize: 12,
    spacing: 0
  });
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
                await Promise.all([loadFontMappings(), loadModels()]);
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

  const loadFontMappings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/font-mappings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFontMappings(data.fontMappings.sort((a: FontMapping, b: FontMapping) => 
          a.modelName.localeCompare(b.modelName) || a.yearStart - b.yearStart
        ));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao carregar mapeamentos de fonte');
      }
    } catch (error) {
      console.error('Erro ao carregar mapeamentos de fonte:', error);
      setError('Erro ao carregar mapeamentos de fonte');
    }
  };

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
        setModels(data.models.filter((m: Model) => m.active).sort((a: Model, b: Model) => 
          `${a.brandName} ${a.name}`.localeCompare(`${b.brandName} ${b.name}`)
        ));
      } else {
        const errorData = await response.json();
        console.error('Erro ao carregar modelos:', errorData.error);
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    }
  };

  const handleCreateMapping = async () => {
    setActionLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const selectedModel = models.find(m => m.id === formData.modelId);
      if (!selectedModel) {
        setError('Modelo selecionado não encontrado');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/font-mappings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: formData.id,
          modelId: formData.modelId,
          modelName: selectedModel.name,
          yearStart: formData.yearStart,
          yearEnd: formData.yearEnd,
          fontFileName: formData.fontFileName,
          settings: {
            fontSize: formData.fontSize,
            spacing: formData.spacing
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        await loadFontMappings();
        setShowModal(false);
        setFormData({
          id: '',
          modelId: '',
          yearStart: 2000,
          yearEnd: 2024,
          fontFileName: '',
          fontSize: 12,
          spacing: 0
        });
      } else {
        setError(data.error || 'Erro ao criar mapeamento');
      }
    } catch {
      setError('Erro ao criar mapeamento');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateMapping = async () => {
    if (!selectedMapping) return;
    
    setActionLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const selectedModel = models.find(m => m.id === formData.modelId);
      if (!selectedModel) {
        setError('Modelo selecionado não encontrado');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch(`/api/font-mappings/${selectedMapping.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          modelId: formData.modelId,
          modelName: selectedModel.name,
          yearStart: formData.yearStart,
          yearEnd: formData.yearEnd,
          fontFileName: formData.fontFileName,
          settings: {
            fontSize: formData.fontSize,
            spacing: formData.spacing
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        await loadFontMappings();
        setShowModal(false);
        setSelectedMapping(null);
        setFormData({
          id: '',
          modelId: '',
          yearStart: 2000,
          yearEnd: 2024,
          fontFileName: '',
          fontSize: 12,
          spacing: 0
        });
      } else {
        setError(data.error || 'Erro ao atualizar mapeamento');
      }
    } catch {
      setError('Erro ao atualizar mapeamento');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMapping = async () => {
    if (!selectedMapping) return;
    
    setActionLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch(`/api/font-mappings/${selectedMapping.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await loadFontMappings();
        setShowModal(false);
        setSelectedMapping(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao excluir mapeamento');
      }
    } catch {
      setError('Erro ao excluir mapeamento');
    } finally {
      setActionLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalType('create');
    setFormData({
      id: '',
      modelId: '',
      yearStart: 2000,
      yearEnd: new Date().getFullYear(),
      fontFileName: '',
      fontSize: 12,
      spacing: 0
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (mapping: FontMapping) => {
    setModalType('edit');
    setSelectedMapping(mapping);
    setFormData({
      id: mapping.id,
      modelId: mapping.modelId,
      yearStart: mapping.yearStart,
      yearEnd: mapping.yearEnd,
      fontFileName: mapping.fontFileName,
      fontSize: mapping.settings.fontSize,
      spacing: mapping.settings.spacing || 0
    });
    setError('');
    setShowModal(true);
  };

  const openDeleteModal = (mapping: FontMapping) => {
    setModalType('delete');
    setSelectedMapping(mapping);
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
          <p className="text-text-secondary">Carregando mapeamentos de fonte...</p>
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
                <h1 className="text-3xl font-bold text-text-primary">Mapeamentos de Fonte</h1>
                <p className="text-text-secondary mt-2">Configure as fontes utilizadas para cada modelo e período</p>
              </div>
              <Button onClick={openCreateModal} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Novo Mapeamento
              </Button>
            </div>
          </div>

          {/* Grid de mapeamentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fontMappings.map((mapping) => {
              const model = models.find(m => m.id === mapping.modelId);
              return (
                <Card key={mapping.id}>
                  <CardContent>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg p-1.5 shadow-sm">
                          <img 
                            src={`/logos/${model?.brandId}.png`}
                            alt={model?.brandName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                            }}
                          />
                          <div className="fallback-icon hidden w-full h-full flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-text-secondary" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary">{mapping.modelName}</h3>
                          <p className="text-sm text-text-secondary">{mapping.yearStart} - {mapping.yearEnd}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-accent-red rounded-lg flex items-center justify-center">
                        <Type className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Arquivo:</span>
                        <code className="text-text-primary bg-bg-secondary px-2 py-1 rounded text-xs font-mono">
                          {mapping.fontFileName}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Tamanho:</span>
                        <span className="text-text-primary font-semibold">{mapping.settings.fontSize}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Espaçamento:</span>
                        <span className="text-text-primary">{mapping.settings.spacing || 0}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-border-secondary">
                      <button
                        onClick={() => openEditModal(mapping)}
                        className="flex-1 p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                        title="Editar mapeamento"
                      >
                        <Edit2 className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(mapping)}
                        className="flex-1 p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Excluir mapeamento"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {fontMappings.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Type className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">Nenhum mapeamento de fonte encontrado</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <ModalWrapper 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          title={
            modalType === 'create' ? 'Novo Mapeamento de Fonte' : 
            modalType === 'edit' ? 'Editar Mapeamento de Fonte' : 
            'Excluir Mapeamento de Fonte'
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
                      placeholder="ford-ka-2020-2024"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase() })}
                      required
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Identificador único do mapeamento
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Modelo</label>
                    <Select 
                      value={formData.modelId}
                      onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                      required
                    >
                      <option value="">Selecione um modelo</option>
                      {models.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.brandName} - {model.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Ano Inicial</label>
                      <Input
                        type="number"
                        min="1900"
                        max="2100"
                        value={formData.yearStart}
                        onChange={(e) => setFormData({ ...formData, yearStart: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Ano Final</label>
                      <Input
                        type="number"
                        min="1900"
                        max="2100"
                        value={formData.yearEnd}
                        onChange={(e) => setFormData({ ...formData, yearEnd: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Arquivo da Fonte</label>
                    <Input
                      placeholder="arial.ttf"
                      value={formData.fontFileName}
                      onChange={(e) => setFormData({ ...formData, fontFileName: e.target.value })}
                      required
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Nome do arquivo de fonte em public/fonts/
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Tamanho da Fonte</label>
                      <Input
                        type="number"
                        min="6"
                        max="72"
                        value={formData.fontSize}
                        onChange={(e) => setFormData({ ...formData, fontSize: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Espaçamento</label>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={formData.spacing}
                        onChange={(e) => setFormData({ ...formData, spacing: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateMapping} 
                    disabled={actionLoading || !formData.id || !formData.modelId || !formData.fontFileName}
                    className="flex-1"
                  >
                    {actionLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Criando...
                      </>
                    ) : (
                      'Criar Mapeamento'
                    )}
                  </Button>
                </div>
              </>
            )}

            {modalType === 'edit' && selectedMapping && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">ID</label>
                    <Input value={selectedMapping.id} disabled className="opacity-60" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Modelo</label>
                    <Select 
                      value={formData.modelId}
                      onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                      required
                    >
                      <option value="">Selecione um modelo</option>
                      {models.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.brandName} - {model.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Ano Inicial</label>
                      <Input
                        type="number"
                        min="1900"
                        max="2100"
                        value={formData.yearStart}
                        onChange={(e) => setFormData({ ...formData, yearStart: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Ano Final</label>
                      <Input
                        type="number"
                        min="1900"
                        max="2100"
                        value={formData.yearEnd}
                        onChange={(e) => setFormData({ ...formData, yearEnd: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Arquivo da Fonte</label>
                    <Input
                      value={formData.fontFileName}
                      onChange={(e) => setFormData({ ...formData, fontFileName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Tamanho da Fonte</label>
                      <Input
                        type="number"
                        min="6"
                        max="72"
                        value={formData.fontSize}
                        onChange={(e) => setFormData({ ...formData, fontSize: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Espaçamento</label>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={formData.spacing}
                        onChange={(e) => setFormData({ ...formData, spacing: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleUpdateMapping} 
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

            {modalType === 'delete' && selectedMapping && (
              <>
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Excluir mapeamento de fonte
                  </h3>
                  <p className="text-text-secondary">
                    Tem certeza que deseja excluir o mapeamento para <strong>{selectedMapping.modelName}</strong> 
                    ({selectedMapping.yearStart} - {selectedMapping.yearEnd})?<br />
                    Esta ação não pode ser desfeita.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleDeleteMapping} 
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