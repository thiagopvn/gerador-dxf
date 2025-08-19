'use client';

import { Model, Brand } from '@/lib/types';

interface ModelSelectionProps {
  models: Model[];
  selectedBrand: Brand;
  onSelect: (model: Model) => void;
  onBack: () => void;
}

export default function ModelSelection({ models, selectedBrand, onSelect, onBack }: ModelSelectionProps) {
  const filteredModels = models.filter(model => 
    model.brandId === selectedBrand.id && model.active
  );

  return (
    <div style={{
      width: '100%',
      padding: '2rem 1rem'
    }}>
      {/* Back Button */}
      <div style={{
        marginBottom: '2rem'
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#a0a0a0',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#a0a0a0';
          }}
        >
          <span style={{ marginRight: '0.5rem' }}>←</span>
          Voltar às Marcas
        </button>
      </div>

      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '0.5rem'
        }}>
          2. Selecione o Modelo
        </h2>
        <p style={{
          fontSize: '1.125rem',
          color: '#a0a0a0'
        }}>
          Escolha o modelo do <span style={{ color: '#E50914', fontWeight: '600' }}>{selectedBrand.name}</span>
        </p>
      </div>

      {/* Models Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {filteredModels.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.borderColor = '#E50914';
              e.currentTarget.style.backgroundColor = '#242424';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = '#2a2a2a';
              e.currentTarget.style.backgroundColor = '#1a1a1a';
            }}
          >
            <div style={{ flex: '1' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '0.25rem'
              }}>
                {model.name}
              </h3>
              <p style={{
                color: '#a0a0a0',
                fontSize: '0.875rem'
              }}>
                {model.brandName}
              </p>
            </div>
            
            {/* Arrow Icon */}
            <div style={{
              marginLeft: '1rem',
              color: '#a0a0a0',
              fontSize: '1.5rem'
            }}>
              →
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredModels.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 0'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#1a1a1a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <span style={{ fontSize: '1.5rem' }}>📋</span>
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '0.5rem'
          }}>
            Nenhum modelo encontrado
          </h3>
          <p style={{
            color: '#a0a0a0'
          }}>
            Não há modelos disponíveis para {selectedBrand.name}
          </p>
        </div>
      )}
    </div>
  );
}