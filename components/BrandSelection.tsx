'use client';

import { Brand } from '@/lib/types';

interface BrandSelectionProps {
  brands: Brand[];
  onSelect: (brand: Brand) => void;
}

export default function BrandSelection({ brands, onSelect }: BrandSelectionProps) {
  // Use provided brands or fallback data for demo
  const defaultBrands = [
    { id: '1', name: 'Ford', active: true, order: 1 },
    { id: '2', name: 'Chevrolet', active: true, order: 2 },
    { id: '3', name: 'Volkswagen', active: true, order: 3 },
    { id: '4', name: 'Fiat', active: true, order: 4 },
    { id: '5', name: 'Honda', active: true, order: 5 },
    { id: '6', name: 'Toyota', active: true, order: 6 },
    { id: '7', name: 'Hyundai', active: true, order: 7 },
    { id: '8', name: 'Nissan', active: true, order: 8 },
  ];

  const activeBrands = (brands.length > 0 ? brands : defaultBrands).filter((brand: any) => brand.active);

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Selecione a Marca</h2>
        <p className="text-muted mt-2">Escolha a marca do veículo para continuar</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeBrands.map((brand: any) => (
          <div 
            key={brand.id} 
            className="bg-card border border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:scale-105 transition-all duration-200"
            onClick={() => onSelect(brand)}
          >
            <p className="font-semibold">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}