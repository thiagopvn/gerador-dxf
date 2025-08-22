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

// GET - Listar marcas
export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const brandsSnapshot = await adminDb.collection('brands').orderBy('order').get();
    const brands = brandsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ brands });
  } catch (error) {
    console.error('Erro ao listar marcas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar marca
export async function POST(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { id, name, active, order } = await request.json();

    if (!id || !name || order === undefined) {
      return NextResponse.json(
        { error: 'ID, nome e ordem são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se a marca já existe
    const existingBrand = await adminDb.collection('brands').doc(id).get();
    if (existingBrand.exists) {
      return NextResponse.json(
        { error: 'Uma marca com este ID já existe' },
        { status: 409 }
      );
    }

    // Criar marca no Firestore
    await adminDb.collection('brands').doc(id).set({
      name,
      active: active ?? true,
      order: Number(order),
      createdAt: new Date(),
      createdBy: adminUser.uid
    });

    return NextResponse.json({ 
      success: true,
      id
    });
  } catch (error) {
    console.error('Erro ao criar marca:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}