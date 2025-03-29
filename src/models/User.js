import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email é obrigatório'], 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido']
  },
  senha: { 
    type: String, 
    required: [true, 'Senha é obrigatória']
  },
  tipo: { 
    type: String, 
    enum: {
      values: ['aluno', 'professor'],
      message: 'Tipo deve ser aluno ou professor'
    },
    required: [true, 'Tipo de usuário é obrigatório']
  },
  escola: { 
    type: String, 
    required: [true, 'Nome da escola é obrigatório'],
    trim: true
  },
  turma: { 
    type: String,
    trim: true
  },
  professorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Adicionando índices para melhorar o desempenho
UserSchema.index({ email: 1 });
UserSchema.index({ escola: 1, tipo: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema); 