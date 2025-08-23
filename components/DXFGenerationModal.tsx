'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { FileText, Calendar, Hash, Settings, Download, AlertCircle } from 'lucide-react';

interface DXFGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  modelName: string;
  modelId: string;
  onSuccess?: () => void;
}

export default function DXFGenerationModal({
  isOpen,
  onClose,
  brandName,
  modelName,
  modelId,
  onSuccess
}: DXFGenerationModalProps) {
  const [year, setYear] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [engineNumber, setEngineNumber] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!year || !chassisNumber || !engineNumber) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-dxf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId,
          year: parseInt(year),
          chassisNumber: chassisNumber.toUpperCase(),
          engineNumber: engineNumber.toUpperCase()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar arquivo DXF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brandName}_${modelName}_${chassisNumber}.dxf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      console.error('Erro ao gerar DXF:', err);
      setError(err instanceof Error ? err.message : 'Erro ao gerar arquivo DXF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setYear('');
    setChassisNumber('');
    setEngineNumber('');
    setError(null);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Gerar Arquivo DXF"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-background/50 rounded-lg p-4 border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Informações do Veículo</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted">Marca:</span>
              <span className="ml-2 text-foreground font-medium">{brandName}</span>
            </div>
            <div>
              <span className="text-muted">Modelo:</span>
              <span className="ml-2 text-foreground font-medium">{modelName}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-foreground mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Ano de Fabricação *</span>
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
              required
            >
              <option value="">Selecione o ano</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-foreground mb-2">
              <Hash className="h-4 w-4 text-primary" />
              <span>Número do Chassi *</span>
            </label>
            <input
              type="text"
              value={chassisNumber}
              onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
              placeholder="Ex: 9BW123456789012345"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors"
              maxLength={17}
              required
            />
            <p className="text-xs text-muted mt-1">17 caracteres alfanuméricos</p>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-foreground mb-2">
              <Settings className="h-4 w-4 text-primary" />
              <span>Número do Motor *</span>
            </label>
            <input
              type="text"
              value={engineNumber}
              onChange={(e) => setEngineNumber(e.target.value.toUpperCase())}
              placeholder="Ex: ABC123456"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground hover:bg-background/80 transition-colors font-medium"
            disabled={isGenerating}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Gerando...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Gerar DXF</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}