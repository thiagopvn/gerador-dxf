'use client';

import { Model, Brand } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface ModelSelectionProps {
  models: Model[];
  selectedBrand: Brand;
  onSelect: (model: Model) => void;
  onBack: () => void;
}

export default function ModelSelection({ models, selectedBrand, onSelect, onBack }: ModelSelectionProps) {
  // Use provided models or fallback data for demo
  const defaultModels = [
    { id: '1', name: 'Onix', brandId: selectedBrand.id, active: true, brandName: selectedBrand.name },
    { id: '2', name: 'Prisma', brandId: selectedBrand.id, active: true, brandName: selectedBrand.name },
    { id: '3', name: 'Cruze', brandId: selectedBrand.id, active: true, brandName: selectedBrand.name },
  ];

  const filteredModels = models.length > 0 
    ? models.filter(model => model.brandId === selectedBrand.id && model.active)
    : defaultModels;

  return (
    <div className="w-full">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="secondary" onClick={onBack} className="w-auto px-4">
          ← Voltar às Marcas
        </Button>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Selecione o Modelo</h2>
        <p className="text-muted mt-2">Escolha o modelo do {selectedBrand.name}</p>
      </div>
      <div className="space-y-4">
        {filteredModels.map((model) => (
          <div 
            key={model.id} 
            className="bg-card border border-border rounded-lg p-4 flex justify-between items-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelect(model)}
          >
            <p className="font-semibold">{model.name}</p>
            <span className="text-muted">&gt;</span>
          </div>
        ))}
      </div>
    </div>
  );
}