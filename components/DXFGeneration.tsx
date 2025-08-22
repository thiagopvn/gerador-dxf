'use client';

import { useState } from 'react';
import { Model, Brand } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import ModalWrapper from '@/components/layout/ModalWrapper';
import { 
  ArrowLeft, 
  FileDown, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Zap,
  Clock
} from 'lucide-react';

interface User {
  uid: string;
  email: string | null;
  role: string;
}

interface DXFGenerationProps {
  selectedModel: Model;
  selectedBrand: Brand;
  onBack: () => void;
  user: User;
}

export default function DXFGeneration({ selectedModel, selectedBrand, onBack }: DXFGenerationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [year, setYear] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [engineNumber, setEngineNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!year) {
      errors.year = 'O ano do veículo é obrigatório';
    }
    
    if (!chassisNumber) {
      errors.chassisNumber = 'O número do chassi é obrigatório';
    } else if (chassisNumber.length !== 17) {
      errors.chassisNumber = 'O número do chassi deve ter exatamente 17 caracteres';
    } else if (!/^[A-Z0-9]+$/.test(chassisNumber)) {
      errors.chassisNumber = 'O número do chassi deve conter apenas letras e números';
    }
    
    if (engineNumber && engineNumber.length > 20) {
      errors.engineNumber = 'O número do motor não pode ter mais de 20 caracteres';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/generate-dxf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId: selectedModel.id,
          year: parseInt(year),
          chassisNumber: chassisNumber.trim(),
          engineNumber: engineNumber.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na geração do DXF');
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
      setTimeout(() => {
        setSuccess(false);
        setIsModalOpen(false);
        // Reset form
        setYear('');
        setChassisNumber('');
        setEngineNumber('');
        setValidationErrors({});
      }, 2000);
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao gerar DXF');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const futureYear = currentYear + 2;
  const years = Array.from({ length: futureYear - 1900 + 1 }, (_, i) => futureYear - i).filter(y => y >= 1900);

  return (
    <div className="w-full animate-fade-in max-w-2xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Button 
          variant="secondary" 
          onClick={onBack}
          className="group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform mr-2" />
          Voltar aos Modelos
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-red rounded-2xl glow-red mb-6">
          <FileText className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Gerar Arquivo DXF
        </h2>
        <p className="text-lg text-muted mb-6">
          <span className="text-primary font-semibold">{selectedBrand.name} {selectedModel.name}</span>
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-primary text-sm font-medium">Pronto para gerar</span>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Veículo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Vehicle Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-bg-primary border border-border-secondary rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Marca</p>
                <p className="text-base font-semibold text-text-primary">{selectedBrand.name}</p>
              </div>
              <div className="bg-bg-primary border border-border-secondary rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Modelo</p>
                <p className="text-base font-semibold text-text-primary">{selectedModel.name}</p>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="bg-bg-primary border border-border-secondary rounded-lg p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Instruções
              </h3>
              <ul className="space-y-1 text-sm text-text-secondary">
                <li>• Preencha os dados do veículo no formulário</li>
                <li>• O número do chassi deve ter exatamente 17 caracteres</li>
                <li>• O arquivo DXF será baixado automaticamente</li>
              </ul>
            </div>

            {/* Generate Button */}
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full"
            >
              <FileDown className="w-5 h-5 mr-2" />
              Gerar Arquivo DXF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => {
          if (!loading) {
            setIsModalOpen(false);
            setError('');
            setValidationErrors({});
          }
        }}
        title="Gerar Arquivo DXF"
        size="lg"
      >
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error Message */}
              {error && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-4 animate-slide-down">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-error">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-4 animate-slide-down">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-success">
                      Arquivo DXF gerado e baixado com sucesso!
                    </p>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Year Field */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Ano do Veículo
                  </label>
                  <Select
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      setValidationErrors({...validationErrors, year: ''});
                    }}
                    className={validationErrors.year ? 'border-error' : ''}
                  >
                    <option value="">Selecione o ano</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Select>
                  <p className="text-xs text-text-secondary mt-1">
                    Selecione o ano de fabricação do veículo (1900 - {futureYear})
                  </p>
                  {validationErrors.year && (
                    <p className="text-xs text-error mt-1">{validationErrors.year}</p>
                  )}
                </div>

                {/* Chassis Number */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Número do Chassi
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: 9BWZZZ377VT004251"
                    value={chassisNumber}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      setChassisNumber(value);
                      setValidationErrors({...validationErrors, chassisNumber: ''});
                    }}
                    maxLength={17}
                    className={validationErrors.chassisNumber ? 'border-error' : ''}
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Obrigatório - 17 caracteres alfanuméricos ({chassisNumber.length}/17)
                  </p>
                  {validationErrors.chassisNumber && (
                    <p className="text-xs text-error mt-1">{validationErrors.chassisNumber}</p>
                  )}
                </div>

                {/* Engine Number */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Número do Motor
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: ABC123456789 (opcional)"
                    value={engineNumber}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      setEngineNumber(value);
                      setValidationErrors({...validationErrors, engineNumber: ''});
                    }}
                    maxLength={20}
                    className={validationErrors.engineNumber ? 'border-error' : ''}
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Opcional - Até 20 caracteres
                  </p>
                  {validationErrors.engineNumber && (
                    <p className="text-xs text-error mt-1">{validationErrors.engineNumber}</p>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4 border-t border-border-secondary">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (!loading) {
                      setIsModalOpen(false);
                      setError('');
                      setValidationErrors({});
                    }
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Gerando DXF...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-5 h-5 mr-2" />
                      Gerar DXF
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </ModalWrapper>

      {/* Info Footer */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
          <Clock className="w-4 h-4 text-muted" />
          <span className="text-sm text-muted">
            O arquivo será baixado automaticamente
          </span>
        </div>
      </div>
    </div>
  );
}