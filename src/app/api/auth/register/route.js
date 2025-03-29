import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { nome, email, senha, tipo, escola, professorId } = await request.json();
    
    await dbConnect();
    
    // Verificar se email já existe
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }
    
    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);
    
    // Criar novo usuário
    const novoUsuario = new User({
      nome,
      email,
      senha: senhaHash,
      tipo,
      escola,
      professorId
    });
    
    await novoUsuario.save();
    
    // Retornar usuário sem senha
    const userSemSenha = { 
      id: novoUsuario._id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      tipo: novoUsuario.tipo,
      escola: novoUsuario.escola
    };
    
    return NextResponse.json({ user: userSemSenha });
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 