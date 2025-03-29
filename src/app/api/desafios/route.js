import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Desafio from '@/models/Desafio';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const professorId = searchParams.get('professorId');
    
    await dbConnect();
    
    const query = professorId ? { professorId } : {};
    const desafios = await Desafio.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(desafios);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const desafioData = await request.json();
    
    await dbConnect();
    
    const novoDesafio = new Desafio(desafioData);
    await novoDesafio.save();
    
    return NextResponse.json(novoDesafio);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 