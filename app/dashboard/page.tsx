'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Header from '@/components/Header';
import BrandSelection from '@/components/BrandSelection';
import ModelSelection from '@/components/ModelSelection';
import DXFGeneration from '@/components/DXFGeneration';
import { Brand, Model } from '@/lib/types';
import { brands } from '@/data/brands';
import { models } from '@/data/models';

type Step = 'brands' | 'models' | 'generate';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('brands');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role || 'user';
        
        if (role === 'admin') {
          router.push('/admin');
          return;
        }
        
        setUser({
          email: user.email,
          role,
          getIdToken: () => user.getIdToken(),
        });
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
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

  const handleBackToModels = () => {
    setSelectedModel(null);
    setStep('models');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {step === 'brands' && (
          <BrandSelection brands={brands} onSelect={handleBrandSelect} />
        )}

        {step === 'models' && selectedBrand && (
          <ModelSelection
            models={models}
            selectedBrand={selectedBrand}
            onSelect={handleModelSelect}
            onBack={handleBackToBrands}
          />
        )}

        {step === 'generate' && selectedModel && selectedBrand && (
          <DXFGeneration
            selectedModel={selectedModel}
            selectedBrand={selectedBrand}
            onBack={handleBackToModels}
            user={user}
          />
        )}
      </main>
    </div>
  );
}