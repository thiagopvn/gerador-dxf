import { NextRequest, NextResponse } from 'next/server';

// API de demonstração para gerenciar usuários (sem Firebase Admin SDK)
// Em produção, usar Firebase Admin SDK para validação real

// Mock users para demonstração
const mockUsers = [
  {
    uid: 'admin-demo-uid',
    email: 'admin@remarcacao.com',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    uid: 'user-demo-uid',
    email: 'user@teste.com',
    role: 'user',
    createdAt: new Date('2024-01-02'),
  }
];

// GET - Listar usuários (demo)
export async function GET() {
  try {
    // Em uma implementação real, verificar JWT token do Firebase
    return NextResponse.json({ users: mockUsers });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar usuário (demo)
export async function POST(request: NextRequest) {
  try {
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

    // Verificar se email já existe
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está em uso' },
        { status: 400 }
      );
    }

    // Criar usuário mock
    const newUser = {
      uid: `demo-${Date.now()}`,
      email,
      role,
      createdAt: new Date()
    };

    mockUsers.push(newUser);

    return NextResponse.json({ 
      success: true,
      uid: newUser.uid
    });
  } catch (error: unknown) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 400 }
    );
  }
}