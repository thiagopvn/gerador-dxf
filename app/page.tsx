import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Remarcação de Chassi
          </h1>
          <p className="text-[#a0a0a0] text-lg">
            Plataforma de geração de arquivos DXF
          </p>
        </div>
        
        <div className="mb-8">
          <div className="w-24 h-24 bg-[#E50914] rounded-full mx-auto flex items-center justify-center mb-4">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
        </div>

        <Link 
          href="/login" 
          className="btn-primary inline-block"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}
