import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  console.log("API de registro - Requisição recebida");
  try {
    const body = await request.json();
    console.log("Dados recebidos:", JSON.stringify(body));
    
    const { nome, email, senha, tipo, escola, professorId } = body;
    
    console.log("Conectando ao MongoDB...");
    await dbConnect();
    console.log("Conexão com MongoDB estabelecida");
    
    // Verificar se email já existe
    console.log("Verificando se email já existe:", email);
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      console.log("Email já cadastrado:", email);
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }
    
    // Hash da senha
    console.log("Gerando hash da senha");
    const senhaHash = await bcrypt.hash(senha, 10);
    
    // Criar novo usuário
    console.log("Criando novo usuário no banco de dados");
    const novoUsuario = new User({
      nome,
      email,
      senha: senhaHash,
      tipo,
      escola,
      professorId
    });
    
    console.log("Salvando usuário...");
    await novoUsuario.save();
    console.log("Usuário salvo com sucesso. ID:", novoUsuario._id);
    
    // Retornar usuário sem senha
    const userSemSenha = { 
      id: novoUsuario._id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      tipo: novoUsuario.tipo,
      escola: novoUsuario.escola
    };
    
    console.log("Retornando usuário criado sem senha");
    return NextResponse.json({ user: userSemSenha });
  } catch (error) {
    console.error('Erro detalhado no registro:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 