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

// GET - Listar modelos
export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const modelsSnapshot = await adminDb.collection('models').get();
    const models = modelsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ models });
  } catch (error) {
    console.error('Erro ao listar modelos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar modelo
export async function POST(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { id, name, brandId, brandName, active } = await request.json();

    if (!id || !name || !brandId || !brandName) {
      return NextResponse.json(
        { error: 'ID, nome, brandId e brandName são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o modelo já existe
    const existingModel = await adminDb.collection('models').doc(id).get();
    if (existingModel.exists) {
      return NextResponse.json(
        { error: 'Um modelo com este ID já existe' },
        { status: 409 }
      );
    }

    // Verificar se a marca existe
    const brandDoc = await adminDb.collection('brands').doc(brandId).get();
    if (!brandDoc.exists) {
      return NextResponse.json(
        { error: 'Marca não encontrada' },
        { status: 404 }
      );
    }

    // Criar modelo no Firestore
    await adminDb.collection('models').doc(id).set({
      name,
      brandId,
      brandName,
      active: active ?? true,
      createdAt: new Date(),
      createdBy: adminUser.uid
    });

    return NextResponse.json({ 
      success: true,
      id
    });
  } catch (error) {
    console.error('Erro ao criar modelo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}