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
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

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

      setSuccess(true);

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
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-text-secondary hover:text-text-primary transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar aos Modelos
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          3. Gerar Arquivo DXF
        </h2>
        <p className="text-text-secondary text-lg mb-2">
          <span className="text-accent-red font-semibold">{selectedBrand.name} {selectedModel.name}</span>
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent-red bg-opacity-10 border border-accent-red">
          <svg className="w-4 h-4 text-accent-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-accent-red text-sm font-medium">Pronto para gerar</span>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error bg-opacity-10 border border-error text-error px-4 py-3 rounded-lg text-sm flex items-center">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success bg-opacity-10 border border-success text-success px-4 py-3 rounded-lg text-sm flex items-center">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Arquivo DXF gerado e baixado com sucesso!
              </div>
            )}

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-text-primary mb-2">
                Ano do Veículo
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
                  <option key={y} value={y} className="bg-bg-primary">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="chassis" className="block text-sm font-medium text-text-primary mb-2">
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
              <p className="text-xs text-text-secondary mt-1">
                Máximo 17 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="engine" className="block text-sm font-medium text-text-primary mb-2">
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
              className="btn-primary"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando DXF...
                </div>
              ) : (
                'Gerar Arquivo DXF'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}