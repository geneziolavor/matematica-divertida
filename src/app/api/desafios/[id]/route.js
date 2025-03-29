import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Desafio from '@/models/Desafio';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    await dbConnect();
    
    const desafio = await Desafio.findById(id);
    
    if (!desafio) {
      return NextResponse.json({ error: 'Desafio não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(desafio);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const dadosAtualizados = await request.json();
    
    await dbConnect();
    
    const desafio = await Desafio.findByIdAndUpdate(id, dadosAtualizados, { new: true });
    
    if (!desafio) {
      return NextResponse.json({ error: 'Desafio não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(desafio);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await dbConnect();
    
    const desafio = await Desafio.findByIdAndDelete(id);
    
    if (!desafio) {
      return NextResponse.json({ error: 'Desafio não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Desafio excluído com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 