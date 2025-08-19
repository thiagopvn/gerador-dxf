'use client';

import { Brand } from '@/lib/types';
import Image from 'next/image';

interface BrandSelectionProps {
  brands: Brand[];
  onSelect: (brand: Brand) => void;
}

export default function BrandSelection({ brands, onSelect }: BrandSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Selecione a Marca
        </h2>
        <p className="text-[#a0a0a0]">
          Escolha a marca do veículo para continuar
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands
          .filter(brand => brand.active)
          .sort((a, b) => a.order - b.order)
          .map((brand) => (
            <button
              key={brand.id}
              onClick={() => onSelect(brand)}
              className="card hover:bg-[#2a2a2a] hover:border-accent-red hover:scale-105 transform transition-all duration-200 text-center group"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 relative bg-white rounded-lg p-2">
                  <Image
                    src={brand.logo}
                    alt={`Logo ${brand.name}`}
                    fill
                    className="object-contain p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs text-gray-600 font-medium">${brand.name}</div>`;
                      }
                    }}
                  />
                </div>
                <span className="text-white font-medium group-hover:text-[#E50914] transition-colors">
                  {brand.name}
                </span>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}