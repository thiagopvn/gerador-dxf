'use client';

import { Brand } from '@/lib/types';

interface BrandSelectionProps {
  brands: Brand[];
  onSelect: (brand: Brand) => void;
}

export default function BrandSelection({ brands, onSelect }: BrandSelectionProps) {
  // Cores para diferenciar as marcas
  const brandColors: { [key: string]: string } = {
    'volkswagen': '#004B9B',
    'fiat': '#D81C2A',
    'chevrolet': '#F4B942',
    'ford': '#1F2937',
    'honda': '#DC143C',
    'toyota': '#E50914',
    'hyundai': '#00AAD2',
    'nissan': '#C3002F'
  };

  const getBrandInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const getBrandColor = (id: string) => {
    return brandColors[id] || '#E50914';
  };

  return (
    <div style={{
      width: '100%',
      padding: '2rem 1rem'
    }}>
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
          1. Selecione a Marca
        </h2>
        <p style={{
          fontSize: '1.125rem',
          color: '#a0a0a0'
        }}>
          Escolha a marca do veículo para continuar
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {brands
          .filter(brand => brand.active)
          .sort((a, b) => a.order - b.order)
          .map((brand) => (
            <button
              key={brand.id}
              onClick={() => onSelect(brand)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.borderColor = '#E50914';
                e.currentTarget.style.backgroundColor = '#242424';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
            >
              {/* Logo Placeholder */}
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: getBrandColor(brand.id),
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                  {getBrandInitials(brand.name)}
                </span>
              </div>

              {/* Brand Name */}
              <span style={{
                color: '#ffffff',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                {brand.name}
              </span>
            </button>
          ))}
      </div>

      {brands.filter(brand => brand.active).length === 0 && (
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
            <span style={{ fontSize: '1.5rem' }}>❌</span>
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '0.5rem'
          }}>
            Nenhuma marca disponível
          </h3>
          <p style={{
            color: '#a0a0a0'
          }}>
            Nenhuma marca foi encontrada no momento
          </p>
        </div>
      )}
    </div>
  );
}