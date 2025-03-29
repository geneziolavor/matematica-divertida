import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pontuacao from '@/models/Pontuacao';
import User from '@/models/User';

export async function GET() {
  try {
    console.log("Requisição recebida para obter ranking");
    await dbConnect();
    console.log("Conexão com MongoDB estabelecida");
    
    // Primeiro, verificar se existem pontuações
    const totalPontuacoes = await Pontuacao.countDocuments();
    console.log("Total de pontuações encontradas:", totalPontuacoes);
    
    if (totalPontuacoes === 0) {
      console.log("Nenhuma pontuação encontrada - retornando ranking vazio");
      return NextResponse.json([]);
    }
    
    // Agrupar pontuações por usuário
    const ranking = await Pontuacao.aggregate([
      { $group: {
          _id: "$userId",
          pontuacaoTotal: { $sum: "$pontos" },
          desafiosCompletados: { $count: {} }
        }
      },
      { $sort: { pontuacaoTotal: -1 } },
      { $limit: 100 }
    ]);
    
    console.log("Ranking agrupado:", ranking);
    
    // Preencher dados dos usuários
    const rankingCompleto = [];
    for (const item of ranking) {
      try {
        console.log("Buscando usuário com id:", item._id);
        const user = await User.findById(item._id, 'nome escola tipo');
        
        if (user) {
          console.log("Usuário encontrado:", user.nome);
          rankingCompleto.push({
            userId: item._id,
            nome: user.nome,
            escola: user.escola,
            tipo: user.tipo,
            pontuacaoTotal: item.pontuacaoTotal,
            desafiosCompletados: item.desafiosCompletados
          });
        } else {
          console.log("Usuário não encontrado para id:", item._id);
          // Incluir mesmo sem ter encontrado o usuário - pode ser útil para debug
          rankingCompleto.push({
            userId: item._id,
            nome: "Usuário desconhecido",
            escola: "N/A",
            tipo: "aluno",
            pontuacaoTotal: item.pontuacaoTotal,
            desafiosCompletados: item.desafiosCompletados
          });
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }
    
    console.log("Ranking completo:", rankingCompleto.length, "usuários");
    return NextResponse.json(rankingCompleto);
  } catch (error) {
    console.error("Erro ao obter ranking:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 