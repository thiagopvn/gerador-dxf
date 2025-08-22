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

// PUT - Atualizar modelo
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

    const { name, brandId, brandName, active } = await request.json();

    // Verificar se o modelo existe
    const modelDoc = await adminDb.collection('models').doc(params.id).get();
    if (!modelDoc.exists) {
      return NextResponse.json(
        { error: 'Modelo não encontrado' },
        { status: 404 }
      );
    }

    const updateData: Record<string, string | number | boolean | Date> = { updatedAt: new Date(), updatedBy: adminUser.uid };
    
    if (name !== undefined) updateData.name = name;
    if (active !== undefined) updateData.active = Boolean(active);
    if (brandId !== undefined) {
      // Verificar se a marca existe
      const brandDoc = await adminDb.collection('brands').doc(brandId).get();
      if (!brandDoc.exists) {
        return NextResponse.json(
          { error: 'Marca não encontrada' },
          { status: 404 }
        );
      }
      updateData.brandId = brandId;
      if (brandName !== undefined) updateData.brandName = brandName;
    }

    // Atualizar modelo no Firestore
    await adminDb.collection('models').doc(params.id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar modelo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir modelo
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

    // Verificar se o modelo existe
    const modelDoc = await adminDb.collection('models').doc(params.id).get();
    if (!modelDoc.exists) {
      return NextResponse.json(
        { error: 'Modelo não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se existem mapeamentos de fonte associados a este modelo
    const fontMappingsSnapshot = await adminDb.collection('fontMappings').where('modelId', '==', params.id).limit(1).get();
    if (!fontMappingsSnapshot.empty) {
      return NextResponse.json(
        { error: 'Não é possível excluir um modelo que possui mapeamentos de fonte associados' },
        { status: 409 }
      );
    }

    // Excluir modelo do Firestore
    await adminDb.collection('models').doc(params.id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir modelo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}