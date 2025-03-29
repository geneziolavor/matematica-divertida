import mongoose from 'mongoose';

const PontuacaoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  desafioId: String,
  pontos: Number,
  tempoConcluido: Number,
  data: { type: Date, default: Date.now }
});

export default mongoose.models.Pontuacao || mongoose.model('Pontuacao', PontuacaoSchema); 