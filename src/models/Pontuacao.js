import mongoose from 'mongoose';

const PontuacaoSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.Mixed,
    required: true,
    ref: 'User'
  },
  desafioId: { 
    type: String,
    required: true
  },
  pontos: { 
    type: Number,
    required: true 
  },
  tempoConcluido: { 
    type: Number,
    required: true 
  },
  data: { 
    type: Date, 
    default: Date.now 
  }
});

PontuacaoSchema.index({ userId: 1, desafioId: 1 }, { unique: true });
PontuacaoSchema.index({ pontos: -1 });

PontuacaoSchema.pre('save', function(next) {
  try {
    if (typeof this.userId === 'string' && mongoose.Types.ObjectId.isValid(this.userId)) {
      this.userId = new mongoose.Types.ObjectId(this.userId);
    }
  } catch (err) {
    console.warn('Aviso: Não foi possível converter userId para ObjectId:', err.message);
  }
  next();
});

export default mongoose.models.Pontuacao || mongoose.model('Pontuacao', PontuacaoSchema); 