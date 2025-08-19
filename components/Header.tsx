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
    <header className="w-full h-20 bg-bg-secondary border-b border-border-secondary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center">
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
          <h1 className="text-2xl font-bold text-text-primary">
            DXF<span className="text-accent-red">Generator</span>
          </h1>
        </Link>

        <nav className="flex items-center space-x-4">
          {user && (
            <>
              <div className="text-right">
                <div className="text-sm text-text-primary">{user.email}</div>
                <div className="text-xs text-text-secondary capitalize">
                  {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-text-primary bg-transparent border border-accent-red rounded-md hover:bg-accent-red transition-colors"
                title="Sair"
              >
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}