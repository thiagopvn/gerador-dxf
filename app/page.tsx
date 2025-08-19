import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111111',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Hero Section */}
      <main style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          
          {/* Logo/Icon */}
          <div style={{
            width: '96px',
            height: '96px',
            backgroundColor: '#E50914',
            borderRadius: '50%',
            margin: '0 auto 2rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ 
              color: 'white', 
              fontSize: '36px', 
              fontWeight: 'bold' 
            }}>
              DXF
            </span>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              DXF<span style={{ color: '#E50914' }}>Generator</span>
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#a0a0a0',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Plataforma profissional para geração de arquivos DXF para remarcação de chassi. 
              Interface moderna, processo simplificado e precisão garantida.
            </p>
          </div>

          {/* Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <span style={{ 
                  color: '#E50914', 
                  fontSize: '24px', 
                  fontWeight: 'bold' 
                }}>
                  ⚡
                </span>
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Rápido e Eficiente
              </h3>
              <p style={{ color: '#a0a0a0' }}>
                Geração em segundos com interface intuitiva
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <span style={{ 
                  color: '#E50914', 
                  fontSize: '24px', 
                  fontWeight: 'bold' 
                }}>
                  🔒
                </span>
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Seguro e Confiável
              </h3>
              <p style={{ color: '#a0a0a0' }}>
                Autenticação segura e dados protegidos
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <span style={{ 
                  color: '#E50914', 
                  fontSize: '24px', 
                  fontWeight: 'bold' 
                }}>
                  ⚙️
                </span>
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Configurável
              </h3>
              <p style={{ color: '#a0a0a0' }}>
                Suporte a múltiplas marcas e modelos
              </p>
            </div>
          </div>

          {/* CTA */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Link 
              href="/login" 
              style={{
                display: 'inline-block',
                width: '200px',
                padding: '0.75rem 2rem',
                backgroundColor: '#E50914',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500',
                textAlign: 'center'
              }}
            >
              Acessar Sistema
            </Link>
            <div style={{
              color: '#a0a0a0',
              fontSize: '0.875rem'
            }}>
              Precisa de acesso? Entre em contato com o administrador
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem 0',
        borderTop: '1px solid #2a2a2a'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#a0a0a0',
            fontSize: '0.875rem'
          }}>
            © 2024 DXF Generator. Plataforma de Remarcação de Chassi.
          </p>
        </div>
      </footer>
    </div>
  );
}