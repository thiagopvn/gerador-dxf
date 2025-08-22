'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@remarcacao.com');
  const [password, setPassword] = useState('Admin@2024!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { doc, getDoc } = await import('firebase/firestore');
      const { auth, db } = await import('@/lib/firebase');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role || 'user';
        
        if (userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: 'user',
          createdAt: new Date()
        });
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Erro no login:', error);
      let errorMessage = 'Erro no login. Tente novamente.';
      
      if ((error as { code: string }).code === 'auth/user-not-found' || (error as { code: string }).code === 'auth/wrong-password') {
        errorMessage = 'Email ou senha inválidos.';
      } else if ((error as { code: string }).code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      } else if ((error as { code: string }).code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Link href="/" className="self-start">
            <Button variant="secondary" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold">Acesse sua Conta</h1>
            <p className="text-muted mt-2">Use suas credenciais para acessar o painel</p>
          </div>
        </div>

        <Card>
          <div className="bg-background p-4 rounded-md border border-border mb-6">
            <h3 className="font-semibold text-foreground">Credenciais de Demonstração</h3>
            <p className="text-sm text-muted">Email: admin@remarcacao.com</p>
            <p className="text-sm text-muted">Senha: Admin@2024!</p>
          </div>
          
          {error && (
            <div className="bg-primary/10 border border-primary/20 rounded-md p-3 mb-4">
              <p className="text-sm text-primary">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Email*</label>
              <Input 
                type="email" 
                required 
                placeholder="Digite seu email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Senha*</label>
              <Input 
                type="password" 
                required 
                placeholder="Digite sua senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <Button type="submit" loading={loading}>Entrar</Button>
            </div>
          </form>
        </Card>
        
        <div className="text-center">
          <Link href="/" className="text-sm text-primary hover:underline">← Voltar ao início</Link>
        </div>
      </div>
    </main>
  );
}