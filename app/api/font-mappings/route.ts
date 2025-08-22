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

// GET - Listar mapeamentos de fonte
export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const fontMappingsSnapshot = await adminDb.collection('fontMappings').get();
    const fontMappings = fontMappingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ fontMappings });
  } catch (error) {
    console.error('Erro ao listar mapeamentos de fonte:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar mapeamento de fonte
export async function POST(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { 
      id,
      modelId, 
      modelName,
      yearStart, 
      yearEnd, 
      fontFileName, 
      settings 
    } = await request.json();

    if (!id || !modelId || !modelName || !yearStart || !yearEnd || !fontFileName || !settings) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o mapeamento já existe
    const existingMapping = await adminDb.collection('fontMappings').doc(id).get();
    if (existingMapping.exists) {
      return NextResponse.json(
        { error: 'Um mapeamento com este ID já existe' },
        { status: 409 }
      );
    }

    // Verificar se o modelo existe
    const modelDoc = await adminDb.collection('models').doc(modelId).get();
    if (!modelDoc.exists) {
      return NextResponse.json(
        { error: 'Modelo não encontrado' },
        { status: 404 }
      );
    }

    // Verificar conflitos de período para o mesmo modelo
    const conflictingMappings = await adminDb
      .collection('fontMappings')
      .where('modelId', '==', modelId)
      .get();

    const hasConflict = conflictingMappings.docs.some(doc => {
      const data = doc.data();
      const existingStart = Number(data.yearStart);
      const existingEnd = Number(data.yearEnd);
      const newStart = Number(yearStart);
      const newEnd = Number(yearEnd);
      
      return (newStart <= existingEnd && newEnd >= existingStart);
    });

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Já existe um mapeamento para este modelo no período especificado' },
        { status: 409 }
      );
    }

    // Criar mapeamento no Firestore
    await adminDb.collection('fontMappings').doc(id).set({
      modelId,
      modelName,
      yearStart: Number(yearStart),
      yearEnd: Number(yearEnd),
      fontFileName,
      settings: {
        fontSize: Number(settings.fontSize) || 12,
        spacing: Number(settings.spacing) || 0,
        ...settings
      },
      createdAt: new Date(),
      createdBy: adminUser.uid
    });

    return NextResponse.json({ 
      success: true,
      id
    });
  } catch (error) {
    console.error('Erro ao criar mapeamento de fonte:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}