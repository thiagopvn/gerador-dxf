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

// PUT - Atualizar mapeamento de fonte
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

    const { 
      modelId, 
      modelName,
      yearStart, 
      yearEnd, 
      fontFileName, 
      settings 
    } = await request.json();

    // Verificar se o mapeamento existe
    const mappingDoc = await adminDb.collection('fontMappings').doc(params.id).get();
    if (!mappingDoc.exists) {
      return NextResponse.json(
        { error: 'Mapeamento não encontrado' },
        { status: 404 }
      );
    }

    const updateData: Record<string, string | number | boolean | Date | object> = { 
      updatedAt: new Date(), 
      updatedBy: adminUser.uid 
    };

    if (modelId !== undefined) {
      // Verificar se o modelo existe
      const modelDoc = await adminDb.collection('models').doc(modelId).get();
      if (!modelDoc.exists) {
        return NextResponse.json(
          { error: 'Modelo não encontrado' },
          { status: 404 }
        );
      }
      updateData.modelId = modelId;
      if (modelName !== undefined) updateData.modelName = modelName;
    }

    if (yearStart !== undefined) updateData.yearStart = Number(yearStart);
    if (yearEnd !== undefined) updateData.yearEnd = Number(yearEnd);
    if (fontFileName !== undefined) updateData.fontFileName = fontFileName;
    if (settings !== undefined) {
      updateData.settings = {
        fontSize: Number(settings.fontSize) || 12,
        spacing: Number(settings.spacing) || 0,
        ...settings
      };
    }

    // Verificar conflitos de período se estamos atualizando anos
    if (yearStart !== undefined || yearEnd !== undefined || modelId !== undefined) {
      const currentData = mappingDoc.data();
      const checkModelId = modelId || currentData?.modelId;
      const checkYearStart = yearStart !== undefined ? Number(yearStart) : currentData?.yearStart;
      const checkYearEnd = yearEnd !== undefined ? Number(yearEnd) : currentData?.yearEnd;

      const conflictingMappings = await adminDb
        .collection('fontMappings')
        .where('modelId', '==', checkModelId)
        .get();

      const hasConflict = conflictingMappings.docs.some(doc => {
        if (doc.id === params.id) return false; // Ignore self
        
        const data = doc.data();
        const existingStart = Number(data.yearStart);
        const existingEnd = Number(data.yearEnd);
        
        return (checkYearStart <= existingEnd && checkYearEnd >= existingStart);
      });

      if (hasConflict) {
        return NextResponse.json(
          { error: 'Já existe um mapeamento para este modelo no período especificado' },
          { status: 409 }
        );
      }
    }

    // Atualizar mapeamento no Firestore
    await adminDb.collection('fontMappings').doc(params.id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar mapeamento de fonte:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir mapeamento de fonte
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

    // Verificar se o mapeamento existe
    const mappingDoc = await adminDb.collection('fontMappings').doc(params.id).get();
    if (!mappingDoc.exists) {
      return NextResponse.json(
        { error: 'Mapeamento não encontrado' },
        { status: 404 }
      );
    }

    // Excluir mapeamento do Firestore
    await adminDb.collection('fontMappings').doc(params.id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir mapeamento de fonte:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}