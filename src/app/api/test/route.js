import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ status: 'Conexão com MongoDB estabelecida com sucesso!' });
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 