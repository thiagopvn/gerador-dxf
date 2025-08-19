'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  user?: {
    email: string;
    role: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#E50914] rounded-full flex items-center justify-center">
                <svg 
                  className="w-4 h-4 text-white" 
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
              <h1 className="text-lg font-semibold text-white">
                Remarcação de Chassi
              </h1>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="text-right">
                  <div className="text-sm text-white">{user.email}</div>
                  <div className="text-xs text-[#a0a0a0] capitalize">
                    {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-[#a0a0a0] hover:text-white transition-colors"
                  title="Sair"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}