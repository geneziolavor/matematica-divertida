import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pontuacao from '@/models/Pontuacao';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    const { userId, desafioId, pontos, tempoConcluido } = await request.json();
    
    console.log("Recebido dados de pontuação:", { userId, desafioId, pontos, tempoConcluido });
    
    await dbConnect();
    console.log("Conexão com MongoDB estabelecida");
    
    // Converte userId para ObjectId se for uma string
    let userIdObj = userId;
    try {
      if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
        userIdObj = new mongoose.Types.ObjectId(userId);
        console.log("ID convertido para ObjectId:", userIdObj);
      } else {
        console.log("Usando ID como string:", userId);
      }
    } catch (error) {
      console.error("Erro ao converter ID:", error);
      // Continue usando o ID original
    }
    
    // Verificar se já existe pontuação para atualizar
    const pontuacaoExistente = await Pontuacao.findOne({ 
      $or: [
        { userId: userIdObj },
        { userId: userId.toString() }
      ], 
      desafioId 
    });
    
    console.log("Pontuação existente:", pontuacaoExistente);
    
    if (pontuacaoExistente) {
      // Só atualiza se for maior que a pontuação atual
      if (pontos > pontuacaoExistente.pontos) {
        console.log("Atualizando pontuação existente");
        pontuacaoExistente.pontos = pontos;
        pontuacaoExistente.tempoConcluido = tempoConcluido;
        pontuacaoExistente.data = new Date();
        await pontuacaoExistente.save();
        return NextResponse.json(pontuacaoExistente);
      }
      return NextResponse.json(pontuacaoExistente);
    }
    
    console.log("Criando nova pontuação");
    // Criar nova pontuação
    const novaPontuacao = new Pontuacao({
      userId: userIdObj,
      desafioId,
      pontos,
      tempoConcluido
    });
    
    await novaPontuacao.save();
    console.log("Nova pontuação salva:", novaPontuacao);
    return NextResponse.json(novaPontuacao);
  } catch (error) {
    console.error("Erro na API de pontuações:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log("Buscando pontuações para userId:", userId);
    
    await dbConnect();
    
    const query = userId ? { userId } : {};
    const pontuacoes = await Pontuacao.find(query).sort({ pontos: -1 });
    
    console.log("Pontuações encontradas:", pontuacoes.length);
    return NextResponse.json(pontuacoes);
  } catch (error) {
    console.error("Erro ao buscar pontuações:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 