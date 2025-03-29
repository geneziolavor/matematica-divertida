import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  console.log("API de login - Requisição recebida");
  try {
    const body = await request.json();
    console.log("Dados recebidos (sem senha):", { email: body.email });
    
    const { email, senha } = body;
    
    console.log("Conectando ao MongoDB...");
    await dbConnect();
    console.log("Conexão com MongoDB estabelecida");
    
    console.log("Buscando usuário por email:", email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("Usuário não encontrado:", email);
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    
    console.log("Usuário encontrado, validando senha...");
    const senhaValida = await bcrypt.compare(senha, user.senha);
    
    if (!senhaValida) {
      console.log("Senha incorreta para o usuário:", email);
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }
    
    console.log("Login bem-sucedido para:", email);
    const userSemSenha = { 
      id: user._id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      escola: user.escola
    };
    
    console.log("Retornando informações do usuário (sem senha)");
    return NextResponse.json({ user: userSemSenha });
  } catch (error) {
    console.error("Erro detalhado no login:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 