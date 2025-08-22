'use client';

import { Brand } from '@/lib/types';

interface BrandSelectionProps {
  brands: Brand[];
  onSelect: (brand: Brand) => void;
}

export default function BrandSelection({ brands, onSelect }: BrandSelectionProps) {
  // Use provided brands or fallback data for demo
  const defaultBrands = [
    { id: '1', name: 'Ford', active: true, order: 1, logo: '/logos/ford.png' },
    { id: '2', name: 'Chevrolet', active: true, order: 2, logo: '/logos/chevrolet.png' },
    { id: '3', name: 'Volkswagen', active: true, order: 3, logo: '/logos/volkswagen.png' },
    { id: '4', name: 'Fiat', active: true, order: 4, logo: '/logos/fiat.png' },
    { id: '5', name: 'Honda', active: true, order: 5, logo: '/logos/honda.png' },
    { id: '6', name: 'Toyota', active: true, order: 6, logo: '/logos/toyota.png' },
    { id: '7', name: 'Hyundai', active: true, order: 7, logo: '/logos/hyundai.png' },
    { id: '8', name: 'Nissan', active: true, order: 8, logo: '/logos/nissan.png' },
  ];

  // Add logos to brands if not present
  const brandsWithLogos = (brands.length > 0 ? brands : defaultBrands).map((brand: Brand) => ({
    ...brand,
    logo: brand.logo || `/logos/${brand.name.toLowerCase()}.png`
  }));

  const activeBrands = brandsWithLogos.filter((brand: Brand) => brand.active);

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Selecione a Marca</h2>
        <p className="text-muted mt-2">Escolha a marca do veículo para continuar</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeBrands.map((brand: Brand) => (
          <div 
            key={brand.id} 
            className="bg-card border border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center"
            onClick={() => onSelect(brand)}
          >
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={brand.logo} 
                alt={`Logo ${brand.name}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<div class="text-4xl font-bold text-text-secondary">${brand.name.charAt(0)}</div>`;
                }}
              />
            </div>
            <p className="font-semibold">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}