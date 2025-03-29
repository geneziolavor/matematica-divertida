import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pontuacao from '@/models/Pontuacao';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request) {
  console.log("Requisição recebida para obter ranking");
  try {
    await dbConnect();
    console.log("Conexão com MongoDB estabelecida");
    
    // Obter todas as pontuações
    const pontuacoes = await Pontuacao.find();
    console.log("Total de pontuações encontradas:", pontuacoes.length);
    
    // Agrupar pontuações por usuário
    const pontuacoesPorUsuario = {};
    
    pontuacoes.forEach(pontuacao => {
      const userId = pontuacao.userId.toString();
      
      if (!pontuacoesPorUsuario[userId]) {
        pontuacoesPorUsuario[userId] = {
          pontuacaoTotal: 0,
          desafiosCompletados: 0
        };
      }
      
      pontuacoesPorUsuario[userId].pontuacaoTotal += pontuacao.pontos;
      pontuacoesPorUsuario[userId].desafiosCompletados += 1;
    });
    
    // Converter para array e ordenar
    const ranking = Object.entries(pontuacoesPorUsuario).map(([userId, dados]) => ({
      _id: new mongoose.Types.ObjectId(userId),
      ...dados
    })).sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);
    
    console.log("Ranking agrupado:", ranking);
    
    // Buscar informações dos usuários
    const rankingCompleto = [];
    
    for (const item of ranking) {
      console.log("Buscando usuário com id:", item._id);
      const user = await User.findById(item._id);
      
      if (user) {
        console.log("Usuário encontrado:", user.nome);
        rankingCompleto.push({
          userId: item._id,
          nome: user.nome,
          escola: user.escola,
          pontuacaoTotal: item.pontuacaoTotal,
          desafiosCompletados: item.desafiosCompletados
        });
      }
    }
    
    console.log("Ranking completo:", rankingCompleto.length, "usuários");
    
    return NextResponse.json(rankingCompleto);
  } catch (error) {
    console.error("Erro ao obter ranking:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 