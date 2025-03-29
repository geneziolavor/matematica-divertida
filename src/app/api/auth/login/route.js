import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, senha } = await request.json();
    
    await dbConnect();
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    
    const senhaValida = await bcrypt.compare(senha, user.senha);
    
    if (!senhaValida) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }
    
    const userSemSenha = { 
      id: user._id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      escola: user.escola
    };
    
    return NextResponse.json({ user: userSemSenha });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 