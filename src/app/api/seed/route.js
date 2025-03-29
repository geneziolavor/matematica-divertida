import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Pontuacao from '@/models/Pontuacao';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export async function GET(request) {
  console.log("API de seed - Requisição recebida");
  try {
    // Conectar ao banco de dados
    console.log("Conectando ao MongoDB...");
    await dbConnect();
    console.log("Conexão com MongoDB estabelecida");
    
    // Verificar se já existem usuários
    const usuariosCount = await User.countDocuments();
    console.log("Usuários existentes:", usuariosCount);
    
    if (usuariosCount > 0) {
      return NextResponse.json({
        message: "Dados iniciais já existem. Seed não executado.",
        usuariosCount
      });
    }
    
    // Criar usuários de exemplo
    console.log("Criando usuários de seed...");
    const senhaHash = await bcrypt.hash('senha123', 10);
    
    const usuarios = [
      {
        nome: 'Ana Silva',
        email: 'ana@escola.com',
        senha: senhaHash,
        tipo: 'aluno',
        escola: 'Escola Exemplo'
      },
      {
        nome: 'Pedro Costa',
        email: 'pedro@escola.com',
        senha: senhaHash,
        tipo: 'aluno',
        escola: 'Escola Exemplo'
      },
      {
        nome: 'Maria Oliveira',
        email: 'maria@escola.com',
        senha: senhaHash,
        tipo: 'aluno',
        escola: 'Escola Exemplo'
      },
      {
        nome: 'João Santos',
        email: 'joao@escola.com',
        senha: senhaHash,
        tipo: 'aluno',
        escola: 'Escola Exemplo'
      },
      {
        nome: 'Lucia Ferreira',
        email: 'lucia@escola.com',
        senha: senhaHash,
        tipo: 'aluno',
        escola: 'Escola Exemplo'
      },
      {
        nome: 'Carlos Professor',
        email: 'carlos@escola.com',
        senha: senhaHash,
        tipo: 'professor',
        escola: 'Escola Exemplo'
      }
    ];
    
    // Inserir usuários
    console.log("Inserindo usuários no banco de dados...");
    const usuariosCriados = await User.insertMany(usuarios);
    console.log("Usuários criados:", usuariosCriados.length);
    
    // Criar algumas pontuações
    console.log("Criando pontuações de exemplo...");
    const pontuacoes = [];
    const desafiosIds = ['aritmetica', 'geometria', 'aleatorio'];
    
    // Criar pontuações para cada aluno
    for (let i = 0; i < 5; i++) { // Apenas os alunos
      const userId = usuariosCriados[i]._id;
      
      // Cada aluno terá 1-3 pontuações aleatórias
      const numPontuacoes = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < numPontuacoes; j++) {
        const desafioId = desafiosIds[Math.floor(Math.random() * desafiosIds.length)];
        const pontos = Math.floor(Math.random() * 500) + 100;
        const tempoConcluido = Math.floor(Math.random() * 300) + 60;
        
        pontuacoes.push({
          userId,
          desafioId,
          pontos,
          tempoConcluido
        });
      }
    }
    
    // Inserir pontuações
    console.log("Inserindo pontuações no banco de dados...");
    const pontuacoesCriadas = await Pontuacao.insertMany(pontuacoes);
    console.log("Pontuações criadas:", pontuacoesCriadas.length);
    
    return NextResponse.json({
      success: true,
      message: "Seed executado com sucesso",
      usuariosCriados: usuariosCriados.length,
      pontuacoesCriadas: pontuacoesCriadas.length
    });
  } catch (error) {
    console.error("Erro na API de seed:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 