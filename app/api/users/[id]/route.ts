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

// PUT - Atualizar usuário (apenas para admins)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const userId = id;
    const { role } = await request.json();

    if (!role || (role !== 'admin' && role !== 'user')) {
      return NextResponse.json(
        { error: 'Role deve ser "admin" ou "user"' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar apenas a role no Firestore
    await adminDb.collection('users').doc(userId).update({
      role,
      updatedAt: new Date(),
      updatedBy: adminUser.uid
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir usuário (apenas para admins)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const userId = id;

    // Verificar se não está tentando excluir a si mesmo
    if (userId === adminUser.uid) {
      return NextResponse.json(
        { error: 'Não é possível excluir sua própria conta' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Excluir usuário do Firebase Auth
    await adminAuth.deleteUser(userId);
    
    // Excluir documento do Firestore
    await adminDb.collection('users').doc(userId).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error);
    
    let errorMessage = 'Erro interno do servidor';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'Usuário não encontrado';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: error.code === 'auth/user-not-found' ? 404 : 500 }
    );
  }
}