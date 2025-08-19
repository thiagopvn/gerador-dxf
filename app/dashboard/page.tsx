'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BrandSelection from '@/components/BrandSelection';
import ModelSelection from '@/components/ModelSelection';
import DXFGeneration from '@/components/DXFGeneration';
import { Brand, Model } from '@/lib/types';
import { brands } from '@/data/brands';
import { models } from '@/data/models';

type Step = 'brands' | 'models' | 'generate';

// Mock user para demonstração
const mockUser = {
  email: 'admin@remarcacao.com',
  role: 'admin'
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('brands');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simula carregamento
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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

  const handleLogout = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#111111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#E50914',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite'
          }}>
            <span style={{ 
              color: 'white', 
              fontSize: '24px', 
              fontWeight: 'bold' 
            }}>
              DXF
            </span>
          </div>
          <p style={{ color: '#a0a0a0', fontSize: '1rem' }}>
            Carregando dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111111',
      color: '#ffffff'
    }}>
      
      {/* Header */}
      <header style={{
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #2a2a2a',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#E50914',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ 
                color: 'white', 
                fontSize: '16px', 
                fontWeight: 'bold' 
              }}>
                DXF
              </span>
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              DXF<span style={{ color: '#E50914' }}>Generator</span>
            </h1>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.875rem' }}>{mockUser.email}</div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#a0a0a0' 
              }}>
                {mockUser.role === 'admin' ? 'Administrador' : 'Usuário'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#ffffff',
                backgroundColor: 'transparent',
                border: '1px solid #E50914',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E50914';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        
        {/* Progress Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Step 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: (step === 'brands' || selectedBrand) ? '#E50914' : '#2a2a2a',
              backgroundColor: (step === 'brands' || selectedBrand) ? '#E50914' : 'transparent',
              color: (step === 'brands' || selectedBrand) ? 'white' : '#a0a0a0',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              1
            </div>

            {/* Line 1 */}
            <div style={{
              width: '64px',
              height: '2px',
              backgroundColor: selectedBrand ? '#E50914' : '#2a2a2a'
            }}></div>

            {/* Step 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: (step === 'models' || selectedModel) ? '#E50914' : '#2a2a2a',
              backgroundColor: (step === 'models' || selectedModel) ? '#E50914' : 'transparent',
              color: (step === 'models' || selectedModel) ? 'white' : '#a0a0a0',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              2
            </div>

            {/* Line 2 */}
            <div style={{
              width: '64px',
              height: '2px',
              backgroundColor: selectedModel ? '#E50914' : '#2a2a2a'
            }}></div>

            {/* Step 3 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: step === 'generate' ? '#E50914' : '#2a2a2a',
              backgroundColor: step === 'generate' ? '#E50914' : 'transparent',
              color: step === 'generate' ? 'white' : '#a0a0a0',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              3
            </div>
          </div>
        </div>

        {/* Content */}
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
            user={mockUser}
          />
        )}
      </main>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}