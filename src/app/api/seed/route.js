import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Pontuacao from '@/models/Pontuacao';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Função para seed de dados
export async function GET() {
  try {
    console.log("Iniciando seed de dados");
    await dbConnect();
    
    // Verificar se já existem dados
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return NextResponse.json({ message: 'Dados já existem no banco, evitando duplicação.' });
    }
    
    // Criar alguns usuários
    console.log("Criando usuários");
    
    const senhaHash = await bcrypt.hash("123456", 10);
    
    // Professor
    const professor = new User({
      nome: "Professor Demo",
      email: "professor@teste.com",
      senha: senhaHash,
      tipo: "professor",
      escola: "Escola Demonstração"
    });
    await professor.save();
    
    // Alunos
    const alunos = [
      { nome: "Ana Silva", email: "ana@teste.com", escola: "Escola Demonstração" },
      { nome: "Pedro Costa", email: "pedro@teste.com", escola: "Escola Modelo" },
      { nome: "Maria Oliveira", email: "maria@teste.com", escola: "Escola Futuro" },
      { nome: "João Santos", email: "joao@teste.com", escola: "Escola Demonstração" },
      { nome: "Lucia Ferreira", email: "lucia@teste.com", escola: "Escola Futuro" }
    ];
    
    const alunosCriados = [];
    
    for (const alunoData of alunos) {
      const aluno = new User({
        nome: alunoData.nome,
        email: alunoData.email,
        senha: senhaHash,
        tipo: "aluno",
        escola: alunoData.escola
      });
      await aluno.save();
      alunosCriados.push(aluno);
    }
    
    // Criar pontuações
    console.log("Criando pontuações");
    
    // IDs de desafios fictícios
    const desafiosIds = ["1", "2", "3", "operacoes"];
    
    // Criar pontuações aleatórias para os alunos
    const pontuacoes = [];
    
    for (const aluno of alunosCriados) {
      for (const desafioId of desafiosIds) {
        if (Math.random() > 0.3) { // 70% de chance de ter feito o desafio
          const pontuacao = new Pontuacao({
            userId: aluno._id,
            desafioId,
            pontos: Math.floor(Math.random() * 500) + 100, // Entre 100 e 600 pontos
            tempoConcluido: Math.floor(Math.random() * 300) + 60 // Entre 60 e 360 segundos
          });
          await pontuacao.save();
          pontuacoes.push(pontuacao);
        }
      }
    }
    
    return NextResponse.json({ 
      message: 'Dados de teste criados com sucesso',
      stats: {
        usuarios: alunosCriados.length + 1, // +1 pelo professor
        pontuacoes: pontuacoes.length
      }
    });
    
  } catch (error) {
    console.error("Erro ao criar seed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 