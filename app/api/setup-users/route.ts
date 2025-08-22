import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const testUsers = [
  {
    email: 'admin@remarcacao.com',
    password: 'Admin@2024!',
    role: 'admin',
    displayName: 'Administrador Sistema'
  },
  {
    email: 'user@remarcacao.com',
    password: 'User@2024!',
    role: 'user',
    displayName: 'Usuário Padrão'
  },
  {
    email: 'teste@remarcacao.com',
    password: 'Teste@2024!',
    role: 'user',
    displayName: 'Usuário Teste'
  }
];

const brands = [
  { id: 'ford', name: 'Ford', active: true, order: 1 },
  { id: 'chevrolet', name: 'Chevrolet', active: true, order: 2 },
  { id: 'volkswagen', name: 'Volkswagen', active: true, order: 3 },
  { id: 'fiat', name: 'Fiat', active: true, order: 4 },
  { id: 'honda', name: 'Honda', active: true, order: 5 },
  { id: 'toyota', name: 'Toyota', active: true, order: 6 },
  { id: 'hyundai', name: 'Hyundai', active: true, order: 7 },
  { id: 'nissan', name: 'Nissan', active: true, order: 8 },
];

const models = [
  { id: 'ford-ka', name: 'Ka', brandId: 'ford', brandName: 'Ford', active: true },
  { id: 'ford-fiesta', name: 'Fiesta', brandId: 'ford', brandName: 'Ford', active: true },
  { id: 'chevrolet-onix', name: 'Onix', brandId: 'chevrolet', brandName: 'Chevrolet', active: true },
  { id: 'chevrolet-prisma', name: 'Prisma', brandId: 'chevrolet', brandName: 'Chevrolet', active: true },
  { id: 'chevrolet-cruze', name: 'Cruze', brandId: 'chevrolet', brandName: 'Chevrolet', active: true },
  { id: 'volkswagen-gol', name: 'Gol', brandId: 'volkswagen', brandName: 'Volkswagen', active: true },
  { id: 'fiat-uno', name: 'Uno', brandId: 'fiat', brandName: 'Fiat', active: true },
];

export async function POST(request: NextRequest) {
  try {
    const results = {
      users: [],
      brands: [],
      models: [],
      errors: []
    };

    // Create test data in Firestore
    console.log('🏷️  Criando marcas no Firestore...');
    for (const brand of brands) {
      try {
        await setDoc(doc(db, 'brands', brand.id), {
          ...brand,
          createdAt: new Date()
        });
        results.brands.push(`✅ ${brand.name}`);
      } catch (error) {
        results.errors.push(`❌ Erro ao criar marca ${brand.name}: ${error}`);
      }
    }

    console.log('🚗 Criando modelos no Firestore...');
    for (const model of models) {
      try {
        await setDoc(doc(db, 'models', model.id), {
          ...model,
          createdAt: new Date()
        });
        results.models.push(`✅ ${model.brandName} ${model.name}`);
      } catch (error) {
        results.errors.push(`❌ Erro ao criar modelo ${model.name}: ${error}`);
      }
    }

    // Note: Creating users with Authentication requires Admin SDK
    // For now, we'll just return the setup data
    results.users = testUsers.map(user => ({
      email: user.email,
      password: user.password,
      role: user.role,
      status: 'pending_manual_creation'
    }));

    return NextResponse.json({
      success: true,
      message: 'Dados de teste criados com sucesso!',
      results,
      instructions: {
        step1: 'Dados de marcas e modelos foram criados no Firestore',
        step2: 'Para criar usuários, acesse o Firebase Console',
        step3: 'Authentication > Users > Add User',
        step4: 'Use as credenciais retornadas em results.users'
      }
    });

  } catch (error) {
    console.error('Erro na configuração:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}