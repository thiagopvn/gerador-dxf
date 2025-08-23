'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import BrandSelection from '@/components/BrandSelection';
import ModelSelection from '@/components/ModelSelection';
import DXFGenerationModal from '@/components/DXFGenerationModal';
import { Brand, Model } from '@/lib/types';

type Step = 'brands' | 'models' | 'generate';

interface User {
  uid: string;
  email: string | null;
  role: string;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<Step>('brands');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            const userData = userDoc.exists() ? userDoc.data() : {};
            const userRole = userData.role || 'user';
            
            // Redireciona admin para o painel administrativo
            if (userRole === 'admin') {
              router.push('/admin');
              return;
            }
            
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userRole
            });
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

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand);
    setStep('models');
  };

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model);
    setStep('generate');
  };

  const handleBackToBrands = () => {
    setSelectedBrand(null);
    setStep('brands');
  };

  const handleLogout = async () => {
    try {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">DXF</span>
          </div>
          <p className="text-muted">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">DXF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-colors ${
                  (step === 'brands' || selectedBrand) ? 'border-primary bg-primary text-white' : 'border-border text-muted'
                }`}>
                  1
                </div>
                <span className="text-xs mt-2 text-muted">Marca</span>
              </div>

              <div className={`w-16 h-0.5 ${selectedBrand ? 'bg-primary' : 'bg-border'}`} />

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-colors ${
                  (step === 'models' || selectedModel) ? 'border-primary bg-primary text-white' : 'border-border text-muted'
                }`}>
                  2
                </div>
                <span className="text-xs mt-2 text-muted">Modelo</span>
              </div>

              <div className={`w-16 h-0.5 ${selectedModel ? 'bg-primary' : 'bg-border'}`} />

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-colors ${
                  step === 'generate' ? 'border-primary bg-primary text-white' : 'border-border text-muted'
                }`}>
                  3
                </div>
                <span className="text-xs mt-2 text-muted">Gerar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          {step === 'brands' && (
            <BrandSelection brands={[]} onSelect={handleBrandSelect} />
          )}

          {step === 'models' && selectedBrand && (
            <ModelSelection
              models={[]}
              selectedBrand={selectedBrand}
              onSelect={handleModelSelect}
              onBack={handleBackToBrands}
            />
          )}

          {step === 'generate' && selectedModel && selectedBrand && (
            <Card>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Geração de DXF</h2>
                <p className="text-muted mb-6">
                  {selectedBrand.name} - {selectedModel.name}
                </p>
                <Button onClick={() => setIsModalOpen(true)}>Gerar Arquivo DXF</Button>
              </div>
            </Card>
          )}

          {selectedModel && selectedBrand && (
            <DXFGenerationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              brandName={selectedBrand.name}
              modelName={selectedModel.name}
              modelId={selectedModel.id}
              onSuccess={() => {
                console.log('DXF gerado com sucesso!');
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}