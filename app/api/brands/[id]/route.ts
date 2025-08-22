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
  } catch {
    return null;
  }
}

// PUT - Atualizar marca
export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { name, active, order } = await request.json();

    // Verificar se a marca existe
    const brandDoc = await adminDb.collection('brands').doc(params.id).get();
    if (!brandDoc.exists) {
      return NextResponse.json(
        { error: 'Marca não encontrada' },
        { status: 404 }
      );
    }

    const updateData: Record<string, string | number | boolean | Date> = { updatedAt: new Date(), updatedBy: adminUser.uid };
    
    if (name !== undefined) updateData.name = name;
    if (active !== undefined) updateData.active = Boolean(active);
    if (order !== undefined) updateData.order = Number(order);

    // Atualizar marca no Firestore
    await adminDb.collection('brands').doc(params.id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar marca:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir marca
export async function DELETE(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Verificar se a marca existe
    const brandDoc = await adminDb.collection('brands').doc(params.id).get();
    if (!brandDoc.exists) {
      return NextResponse.json(
        { error: 'Marca não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se existem modelos associados a esta marca
    const modelsSnapshot = await adminDb.collection('models').where('brandId', '==', params.id).limit(1).get();
    if (!modelsSnapshot.empty) {
      return NextResponse.json(
        { error: 'Não é possível excluir uma marca que possui modelos associados' },
        { status: 409 }
      );
    }

    // Excluir marca do Firestore
    await adminDb.collection('brands').doc(params.id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir marca:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}