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
    
    // Usar aggregation pipeline para obter dados de forma mais eficiente
    const rankingData = await Pontuacao.aggregate([
      // Agrupar pontuações por usuário
      {
        $group: {
          _id: '$userId',
          pontuacaoTotal: { $sum: '$pontos' },
          desafiosCompletados: { $count: {} }
        }
      },
      // Ordenar por pontuação (do maior para o menor)
      { $sort: { pontuacaoTotal: -1 } },
      // Limitar aos top 100 para evitar processamento excessivo
      { $limit: 100 },
      // Adicionar detalhes do usuário (lookup)
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'detalhesUsuario'
        }
      },
      // Desestruturar o array de detalhes
      { $unwind: '$detalhesUsuario' },
      // Projetar apenas os campos necessários
      {
        $project: {
          userId: '$_id',
          nome: '$detalhesUsuario.nome',
          escola: '$detalhesUsuario.escola',
          pontuacaoTotal: 1,
          desafiosCompletados: 1
        }
      }
    ]);
    
    console.log(`Ranking obtido com ${rankingData.length} usuários via aggregation`);
    
    // Se por algum motivo o aggregation falhou ou não retornou dados,
    // recorremos ao método antigo como fallback
    if (!rankingData || rankingData.length === 0) {
      console.log("Usando método alternativo para obter ranking");
      
      // Obter todas as pontuações
      const pontuacoes = await Pontuacao.find().lean();
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
      const ranking = Object.entries(pontuacoesPorUsuario)
        .map(([userId, dados]) => ({
          _id: new mongoose.Types.ObjectId(userId),
          ...dados
        }))
        .sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal)
        .slice(0, 100); // Limitar a 100 resultados
      
      // Buscar todos os usuários de uma vez para evitar múltiplas consultas
      const userIds = ranking.map(item => item._id);
      const users = await User.find({ _id: { $in: userIds } }).lean();
      
      // Criar mapa de usuários por ID para acesso rápido
      const userMap = {};
      users.forEach(user => {
        userMap[user._id.toString()] = user;
      });
      
      // Montar ranking final
      const rankingCompleto = ranking.map(item => {
        const user = userMap[item._id.toString()];
        if (!user) return null;
        
        return {
          userId: item._id,
          nome: user.nome,
          escola: user.escola,
          pontuacaoTotal: item.pontuacaoTotal,
          desafiosCompletados: item.desafiosCompletados
        };
      }).filter(Boolean); // Remover entradas null
      
      console.log("Ranking completo (método alternativo):", rankingCompleto.length, "usuários");
      return NextResponse.json(rankingCompleto);
    }
    
    return NextResponse.json(rankingData);
  } catch (error) {
    console.error("Erro ao obter ranking:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 