import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pontuacao from '@/models/Pontuacao';
import mongoose from 'mongoose';

export async function POST(request) {
  console.log("API de pontuação - Requisição recebida");
  try {
    const body = await request.json();
    console.log("Dados de pontuação recebidos (brutos):", JSON.stringify(body));
    
    const { userId, desafioId, pontos, tempoConcluido } = body;
    
    console.log("Dados de pontuação processados:", { 
      userId, 
      desafioId, 
      pontos, 
      tempoConcluido,
      tipoUserId: typeof userId
    });
    
    console.log("Conectando ao MongoDB...");
    await dbConnect();
    console.log("Conexão com MongoDB estabelecida");
    
    // Converte userId para ObjectId se for uma string
    let userIdObj = userId;
    try {
      if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
        userIdObj = new mongoose.Types.ObjectId(userId);
        console.log("ID convertido para ObjectId:", userIdObj);
      } else if (typeof userId === 'object' && userId !== null) {
        console.log("ID já é um objeto:", userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          console.log("ID de objeto não é um ObjectId válido, tentando converter...");
          if (mongoose.Types.ObjectId.isValid(userId.toString())) {
            userIdObj = new mongoose.Types.ObjectId(userId.toString());
            console.log("ID convertido após toString():", userIdObj);
          }
        }
      } else {
        console.log("Usando ID como está:", userId);
      }
    } catch (error) {
      console.error("Erro ao converter ID:", error);
      // Continue usando o ID original
    }
    
    // Verificar se já existe pontuação para atualizar
    console.log("Buscando pontuação existente...");
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
        console.log("Atualizando pontuação existente de", pontuacaoExistente.pontos, "para", pontos);
        pontuacaoExistente.pontos = pontos;
        pontuacaoExistente.tempoConcluido = tempoConcluido;
        pontuacaoExistente.data = new Date();
        const pontuacaoAtualizada = await pontuacaoExistente.save();
        console.log("Pontuação atualizada com sucesso:", pontuacaoAtualizada);
        return NextResponse.json(pontuacaoAtualizada);
      }
      console.log("Pontuação não atualizada, pois nova pontuação não é maior que a atual");
      return NextResponse.json(pontuacaoExistente);
    }
    
    console.log("Criando nova pontuação para o usuário:", userIdObj);
    // Criar nova pontuação
    const novaPontuacao = new Pontuacao({
      userId: userIdObj,
      desafioId,
      pontos,
      tempoConcluido
    });
    
    console.log("Salvando nova pontuação no banco de dados...");
    const pontuacaoSalva = await novaPontuacao.save();
    console.log("Nova pontuação salva com sucesso:", pontuacaoSalva);
    return NextResponse.json(pontuacaoSalva);
  } catch (error) {
    console.error("Erro detalhado na API de pontuações:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  console.log("API de pontuação - Requisição GET recebida");
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log("Buscando pontuações para userId:", userId);
    
    console.log("Conectando ao MongoDB...");
    await dbConnect();
    console.log("Conexão com MongoDB estabelecida");
    
    const query = userId ? { userId } : {};
    console.log("Query de busca:", query);
    
    const pontuacoes = await Pontuacao.find(query).sort({ pontos: -1 });
    
    console.log("Pontuações encontradas:", pontuacoes.length);
    return NextResponse.json(pontuacoes);
  } catch (error) {
    console.error("Erro detalhado ao buscar pontuações:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 