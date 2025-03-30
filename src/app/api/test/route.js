import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// Modelo temporário apenas para teste
const TestSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now }
});

// Usamos uma coleção específica para teste
const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);

export async function GET(request) {
  console.log("API de teste - Verificação de conexão com MongoDB");
  
  try {
    console.log("Tentando conectar ao MongoDB...");
    await dbConnect();
    console.log("Conexão com MongoDB estabelecida com sucesso");
    
    // Status da conexão: 1 = conectado
    const isConnected = mongoose.connection.readyState === 1;
    
    // Log de informações detalhadas para debug
    console.log("Detalhes da conexão:", {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      uri: process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 15)}...` : "Não definido"
    });
    
    return NextResponse.json({
      connected: isConnected,
      serverTime: new Date().toISOString(),
      message: "Conexão com MongoDB testada com sucesso"
    });
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error.message);
    console.error("Stack trace completo:", error.stack);
    
    return NextResponse.json({
      connected: false,
      error: error.message,
      serverTime: new Date().toISOString()
    }, { status: 500 });
  }
} 