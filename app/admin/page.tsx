'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import Header from '@/components/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import AdminPanel from '@/components/AdminPanel';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth');
        const { doc, getDoc } = await import('firebase/firestore');
        const { auth, db } = await import('@/lib/firebase');
        
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // Usuário autenticado - buscar dados no Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const userRole = userData.role || 'user';
              
              if (userRole === 'admin') {
                setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  role: userRole
                });
              } else {
                // Usuário não é admin - redirecionar para dashboard
                router.push('/dashboard');
                return;
              }
            } else {
              // Usuário sem dados no Firestore - redirecionar para dashboard
              router.push('/dashboard');
              return;
            }
            setLoading(false);
          } else {
            // Não autenticado - redirecionar para login
            router.push('/login');
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <p className="text-text-secondary">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header user={user} />
      <AdminPanel user={user} />
    </div>
  );
}