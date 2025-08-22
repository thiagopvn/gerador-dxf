'use client';

import { useState } from 'react';
import { Model, Brand } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { 
  ArrowLeft, 
  FileDown, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Calendar, 
  Hash, 
  Settings,
  Zap,
  Clock
} from 'lucide-react';

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
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar DXF');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

  return (
    <div className="w-full animate-fade-in max-w-2xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="group"
          icon={<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
        >
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
          <CardTitle>Dados do Veículo</CardTitle>
        </CardHeader>
        <CardContent>
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
            <div className="grid gap-6">
              {/* Year Field */}
              <div className="relative">
                <Select
                  label="Ano do Veículo"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  helperText="Selecione o ano de fabricação do veículo"
                >
                  <option value="">Selecione o ano</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
                <Calendar className="absolute right-3 top-[42px] w-5 h-5 text-muted pointer-events-none" />
              </div>

              {/* Chassis Number */}
              <div className="relative">
                <Input
                  label="Número do Chassi"
                  type="text"
                  placeholder="Digite o número do chassi"
                  value={chassisNumber}
                  onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
                  maxLength={17}
                  required
                  helperText="Máximo 17 caracteres alfanuméricos"
                />
                <Hash className="absolute right-3 top-[42px] w-5 h-5 text-muted pointer-events-none" />
              </div>

              {/* Engine Number */}
              <div className="relative">
                <Input
                  label="Número do Motor"
                  type="text"
                  placeholder="Digite o número do motor"
                  value={engineNumber}
                  onChange={(e) => setEngineNumber(e.target.value.toUpperCase())}
                  required
                  helperText="Número identificador do motor do veículo"
                />
                <Settings className="absolute right-3 top-[42px] w-5 h-5 text-muted pointer-events-none" />
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 border-t border-border">
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading}
                icon={loading ? undefined : <FileDown className="w-5 h-5" />}
              >
                {loading ? 'Gerando DXF...' : 'Gerar Arquivo DXF'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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