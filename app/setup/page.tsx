'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/setup-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setLoading(false);
    }
  };

  const testUsers = [
    {
      email: 'admin@remarcacao.com',
      password: 'Admin@2024!',
      role: 'admin',
      displayName: 'Administrador Sistema'
    },
    {
      email: 'user@remarcacao.com',
      password: 'User@2024!',
      role: 'user',
      displayName: 'Usuário Padrão'
    },
    {
      email: 'teste@remarcacao.com',
      password: 'Teste@2024!',
      role: 'user',
      displayName: 'Usuário Teste'
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔧 Setup da Aplicação</h1>
          <p className="text-muted">Configure dados de teste e usuários para a aplicação</p>
        </div>

        <div className="grid gap-6">
          {/* Botão de Setup */}
          <Card>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Configuração Automática</h2>
              <p className="text-muted mb-6">
                Cria marcas e modelos no Firestore automaticamente
              </p>
              <Button 
                onClick={handleSetup} 
                loading={loading}
                className="text-lg px-8"
              >
                {loading ? 'Configurando...' : 'Executar Setup'}
              </Button>
            </div>
          </Card>

          {/* Usuários para Criar Manualmente */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">👥 Usuários de Teste</h2>
            <p className="text-muted mb-4">
              Crie estes usuários manualmente no Firebase Console:
            </p>
            <p className="text-sm text-primary mb-4">
              🔗 <a 
                href="https://console.firebase.google.com/project/remarcacao-chassi/authentication/users" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
              >
                Abrir Firebase Console
              </a>
            </p>
            <div className="space-y-4">
              {testUsers.map((user, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong className="text-primary">{user.role.toUpperCase()}</strong>
                    </div>
                    <div>
                      <strong>Email:</strong><br />
                      <code className="text-foreground">{user.email}</code>
                    </div>
                    <div>
                      <strong>Senha:</strong><br />
                      <code className="text-foreground">{user.password}</code>
                    </div>
                    <div>
                      <strong>Nome:</strong><br />
                      <span className="text-muted">{user.displayName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Resultado */}
          {result && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">
                {result.success ? '✅ Resultado' : '❌ Erro'}
              </h2>
              
              {result.success ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-primary">Marcas Criadas:</h3>
                    <ul className="text-sm space-y-1">
                      {result.results.brands.map((brand: string, i: number) => (
                        <li key={i} className="text-muted">{brand}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-primary">Modelos Criados:</h3>
                    <ul className="text-sm space-y-1">
                      {result.results.models.map((model: string, i: number) => (
                        <li key={i} className="text-muted">{model}</li>
                      ))}
                    </ul>
                  </div>

                  {result.results.errors.length > 0 && (
                    <div>
                      <h3 className="font-bold text-primary">Erros:</h3>
                      <ul className="text-sm space-y-1">
                        {result.results.errors.map((error: string, i: number) => (
                          <li key={i} className="text-primary">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                    <h3 className="font-bold text-primary mb-2">📋 Próximos Passos:</h3>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Dados de marcas e modelos foram criados no Firestore</li>
                      <li>Acesse o Firebase Console para criar os usuários</li>
                      <li>Use as credenciais mostradas acima</li>
                      <li>Teste o login em <a href="/login" className="text-primary underline">/login</a></li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-primary">{result.error}</p>
                </div>
              )}
            </Card>
          )}

          {/* Links */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">🔗 Links Úteis</h2>
            <div className="space-y-2">
              <div>
                <a href="/" className="text-primary hover:underline">🏠 Página Inicial</a>
              </div>
              <div>
                <a href="/login" className="text-primary hover:underline">🔐 Página de Login</a>
              </div>
              <div>
                <a 
                  href="https://console.firebase.google.com/project/remarcacao-chassi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  🔥 Firebase Console
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}