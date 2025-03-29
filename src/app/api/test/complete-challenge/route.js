import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pontuacao from '@/models/Pontuacao';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const desafioId = searchParams.get('desafioId') || '1';
    const pontos = parseInt(searchParams.get('pontos') || '500');
    
    await dbConnect();
    
    // Encontrar um usuário aleatório para teste
    const usuarios = await User.find({ tipo: 'aluno' }).limit(10);
    
    if (usuarios.length === 0) {
      return NextResponse.json({ error: 'Nenhum usuário encontrado' }, { status: 404 });
    }
    
    // Escolher um usuário aleatório
    const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
    
    // Criar pontuação
    const pontuacao = new Pontuacao({
      userId: usuario._id,
      desafioId,
      pontos,
      tempoConcluido: Math.floor(Math.random() * 300) + 60 // Entre 60 e 360 segundos
    });
    
    await pontuacao.save();
    
    return NextResponse.json({
      message: 'Pontuação criada com sucesso',
      pontuacao: {
        usuario: usuario.nome,
        desafioId,
        pontos,
        tempoConcluido: pontuacao.tempoConcluido
      }
    });
  } catch (error) {
    console.error("Erro ao criar pontuação de teste:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 