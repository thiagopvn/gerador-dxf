import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// Verificar se o usuário é admin
async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Buscar dados do usuário no Firestore
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data();
    if (userData?.role !== 'admin') {
      return null;
    }

    return { uid: decodedToken.uid, ...userData };
  } catch (error) {
    return null;
  }
}

// GET - Listar usuários (apenas para admins)
export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const usersSnapshot = await adminDb.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar usuário (apenas para admins)
export async function POST(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, senha e role são obrigatórios' },
        { status: 400 }
      );
    }

    if (role !== 'admin' && role !== 'user') {
      return NextResponse.json(
        { error: 'Role deve ser "admin" ou "user"' },
        { status: 400 }
      );
    }

    // Criar usuário no Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: true
    });

    // Criar documento no Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      email,
      role,
      createdAt: new Date(),
      createdBy: adminUser.uid
    });

    return NextResponse.json({ 
      success: true,
      uid: userRecord.uid
    });
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    
    let errorMessage = 'Erro interno do servidor';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Este email já está em uso';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Senha muito fraca';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}