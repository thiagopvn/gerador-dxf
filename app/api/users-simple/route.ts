import { NextRequest, NextResponse } from 'next/server';

// Esta é uma versão simplificada que funciona no frontend
// O controle de acesso é feito via regras do Firestore
export async function GET() {
  return NextResponse.json({ 
    message: 'Use o cliente Firebase diretamente para operações de usuário' 
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Use o cliente Firebase diretamente para criar usuários' 
  });
}