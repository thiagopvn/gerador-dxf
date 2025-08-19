'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulação de login para demonstração
    setTimeout(() => {
      if (email === 'admin@remarcacao.com' && password === 'Admin@2024!') {
        // Login de admin bem-sucedido
        router.push('/dashboard'); // Redireciona para dashboard como demo
      } else if (email === 'user@teste.com' && password === '123456') {
        // Login de usuário comum
        router.push('/dashboard');
      } else {
        // Credenciais inválidas
        setError('Email ou senha inválidos. Tente: admin@remarcacao.com / Admin@2024!');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111111',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px'
      }}>
        
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#E50914',
            borderRadius: '50%',
            margin: '0 auto 1rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>DXF</span>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Acesse sua Conta
          </h1>
          <p style={{
            color: '#a0a0a0',
            fontSize: '1rem'
          }}>
            Use suas credenciais para acessar o painel
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: '12px',
          padding: '2rem'
        }}>
          
          {/* Demo Info */}
          <div style={{
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            border: '1px solid #0ea5e9',
            color: '#0ea5e9',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <strong>DEMO:</strong> Use admin@remarcacao.com / Admin@2024!
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            {/* Email Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#a0a0a0',
                marginBottom: '0.5rem'
              }}>
                Email
              </label>
              <input
                type="email"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#111111',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
                placeholder="admin@remarcacao.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#a0a0a0',
                marginBottom: '0.5rem'
              }}>
                Senha
              </label>
              <input
                type="password"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#111111',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
                placeholder="Admin@2024!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#999' : '#E50914',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '0.5rem'
                  }}></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem'
        }}>
          <Link href="/" style={{
            color: '#a0a0a0',
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}>
            ← Voltar ao início
          </Link>
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}