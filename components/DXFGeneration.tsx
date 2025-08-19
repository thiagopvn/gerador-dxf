'use client';

import { useState } from 'react';
import { Model, Brand } from '@/lib/types';

interface DXFGenerationProps {
  selectedModel: Model;
  selectedBrand: Brand;
  onBack: () => void;
  user: any;
}

export default function DXFGeneration({ selectedModel, selectedBrand, onBack, user }: DXFGenerationProps) {
  const [year, setYear] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [engineNumber, setEngineNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/generate-dxf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          modelId: selectedModel.id,
          year: parseInt(year),
          chassisNumber,
          engineNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar DXF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `remarcacao-${selectedBrand.name}-${selectedModel.name}-${year}.dxf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error: any) {
      setError(error.message);
      console.error('Error generating DXF:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

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
          Gerar DXF
        </h2>
        <p className="text-[#a0a0a0]">
          <span className="text-[#E50914] font-medium">{selectedBrand.name} {selectedModel.name}</span>
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#ef4444] bg-opacity-10 border border-[#ef4444] text-[#ef4444] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-white mb-2">
                Ano
              </label>
              <select
                id="year"
                required
                className="input-field"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Selecione o ano</option>
                {years.map((y) => (
                  <option key={y} value={y} className="bg-[#1a1a1a]">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="chassis" className="block text-sm font-medium text-white mb-2">
                Número do Chassi
              </label>
              <input
                id="chassis"
                name="chassis"
                type="text"
                required
                className="input-field"
                placeholder="Digite o número do chassi"
                value={chassisNumber}
                onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
                maxLength={17}
              />
              <p className="text-xs text-[#a0a0a0] mt-1">
                Máximo 17 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="engine" className="block text-sm font-medium text-white mb-2">
                Número do Motor
              </label>
              <input
                id="engine"
                name="engine"
                type="text"
                required
                className="input-field"
                placeholder="Digite o número do motor"
                value={engineNumber}
                onChange={(e) => setEngineNumber(e.target.value.toUpperCase())}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Gerando DXF...' : 'Gerar DXF'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}