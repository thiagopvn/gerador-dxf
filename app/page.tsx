'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">DXF</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Generator</h1>
                <p className="text-xs text-muted">Gerador de DXF</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="secondary">Entrar</Button>
              </Link>
              <Link href="/login">
                <Button>Começar Agora</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8">
              <span>Geração de</span>
              <br />
              <span className="text-primary">Arquivo</span>
              <br />
              <span>Profissional</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted mb-12 max-w-3xl mx-auto uppercase">
              PLATAFORMA AVANÇADA COM PRECISÃO, TÉCNICA E VELOCIDADE.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/login">
                <Button className="text-lg px-8 py-4 h-auto">
                  Acessar Plataforma
                </Button>
              </Link>
              <Button variant="secondary" className="text-lg px-8 py-4 h-auto">
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Por que escolher nossa <span className="text-primary">plataforma</span>?
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              Recursos exclusivos desenvolvidos para profissionais do setor automotivo
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Ultra Rápido</h3>
              <p className="text-muted">Geração instantânea de arquivos DXF com precisão milimétrica</p>
            </Card>
            
            <Card className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Segurança Total</h3>
              <p className="text-muted">Criptografia de ponta a ponta e proteção completa dos dados</p>
            </Card>
            
            <Card className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Personalização</h3>
              <p className="text-muted">Suporte completo para todas as marcas e modelos</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Pronto para <span className="text-primary">começar</span>?
          </h2>
          <p className="text-xl text-muted mb-12 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já transformaram seus processos 
            com nossa plataforma
          </p>
          <Link href="/login">
            <Button className="text-lg px-12 py-4 h-auto">
              Criar Conta Gratuita
            </Button>
          </Link>
          <p className="text-muted text-sm mt-6">
            Não é necessário cartão de crédito • Acesso imediato
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-muted text-sm">
              © 2024 DXF Generator. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-8 text-sm">
              <Link href="#" className="text-muted hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
              <Link href="#" className="text-muted hover:text-foreground transition-colors">
                Privacidade
              </Link>
              <Link href="#" className="text-muted hover:text-foreground transition-colors">
                Suporte
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}