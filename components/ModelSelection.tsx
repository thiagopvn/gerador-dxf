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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-[#a0a0a0] hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Selecione o Modelo
        </h2>
        <p className="text-[#a0a0a0]">
          Escolha o modelo do <span className="text-[#E50914] font-medium">{selectedBrand.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model)}
            className="card hover:bg-[#2a2a2a] hover:border-accent-red hover:scale-105 transform transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium group-hover:text-[#E50914] transition-colors">
                  {model.name}
                </h3>
                <p className="text-[#a0a0a0] text-sm mt-1">
                  {model.brandName}
                </p>
              </div>
              <svg 
                className="w-5 h-5 text-[#a0a0a0] group-hover:text-[#E50914] transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#a0a0a0]">
            Nenhum modelo encontrado para {selectedBrand.name}
          </p>
        </div>
      )}
    </div>
  );
}