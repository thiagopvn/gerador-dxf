'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

  const isAdmin = user?.role === 'admin';
  const dashboardUrl = isAdmin ? '/admin' : '/dashboard';

  return (
    <header className="w-full h-20 bg-card/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={dashboardUrl} className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-red rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              DXF<span className="text-gradient">Generator</span>
            </h1>
            <p className="text-xs text-muted hidden sm:block">
              Geração profissional de DXF
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          {user && (
            <>
              {/* User Info */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-10 h-10 bg-card-hover rounded-full flex items-center justify-center">
                  {isAdmin ? (
                    <Shield className="w-5 h-5 text-primary" />
                  ) : (
                    <User className="w-5 h-5 text-muted" />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {user.email}
                  </div>
                  <div className="text-xs text-muted">
                    {isAdmin ? 'Administrador' : 'Usuário'}
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              <Button
                variant="secondary"
                onClick={handleSignOut}
                className="hover:bg-error hover:border-error hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}