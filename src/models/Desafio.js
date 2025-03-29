import mongoose from 'mongoose';

const AlternativaSchema = new mongoose.Schema({
  id: String,
  texto: String
});

const QuestaoSchema = new mongoose.Schema({
  id: Number,
  enunciado: String,
  alternativas: [AlternativaSchema],
  respostaCorreta: String
});

const DesafioSchema = new mongoose.Schema({
  titulo: String,
  categoria: String,
  nivel: { type: String, enum: ['Fácil', 'Médio', 'Difícil'] },
  pontos: Number,
  tempo: Number, // tempo em minutos
  descricao: String,
  questoes: [QuestaoSchema],
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Desafio || mongoose.model('Desafio', DesafioSchema); 