import { NextRequest, NextResponse } from 'next/server';

// Mock users para demonstração (em produção seria no banco)
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

// PUT - Atualizar usuário (demo)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = id;
    const { role } = await request.json();

    if (!role || (role !== 'admin' && role !== 'user')) {
      return NextResponse.json(
        { error: 'Role deve ser "admin" ou "user"' },
        { status: 400 }
      );
    }

    // Encontrar usuário
    const userIndex = mockUsers.findIndex(u => u.uid === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar role
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      role
    };

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir usuário (demo)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = id;

    // Não permitir excluir o admin principal
    if (userId === 'admin-demo-uid') {
      return NextResponse.json(
        { error: 'Não é possível excluir o administrador principal' },
        { status: 400 }
      );
    }

    // Encontrar usuário
    const userIndex = mockUsers.findIndex(u => u.uid === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Remover usuário
    mockUsers.splice(userIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}