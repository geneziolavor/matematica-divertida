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
  console.log("API de teste - Requisição GET recebida");
  try {
    console.log("Conectando ao MongoDB...");
    await dbConnect();
    console.log("Conexão com MongoDB estabelecida");
    
    // Tentamos ler e escrever na coleção de teste
    console.log("Contando documentos na coleção de teste");
    const count = await Test.countDocuments();
    console.log("Documentos encontrados:", count);
    
    // Criar um novo documento de teste
    console.log("Criando documento de teste");
    const testDoc = new Test({
      message: `Teste de conexão ${new Date().toISOString()}`
    });
    
    console.log("Salvando documento de teste...");
    await testDoc.save();
    console.log("Documento salvo com sucesso. ID:", testDoc._id);
    
    // Recupera todos os documentos de teste (limitado a 5)
    const tests = await Test.find().sort({ timestamp: -1 }).limit(5);
    
    return NextResponse.json({
      status: "success",
      message: "Conexão com MongoDB funcionando corretamente",
      connectionStatus: mongoose.connection.readyState,
      documentsCount: count + 1,
      latestDocuments: tests
    });
  } catch (error) {
    console.error("Erro no teste de conexão:", error);
    console.error("Stack trace:", error.stack);
    
    // Mais detalhes sobre o estado da conexão
    const connectionStatus = mongoose.connection ? mongoose.connection.readyState : "Não disponível";
    const connectionDetails = {
      readyState: connectionStatus,
      host: mongoose.connection ? mongoose.connection.host : "Não disponível",
      name: mongoose.connection ? mongoose.connection.name : "Não disponível"
    };
    
    return NextResponse.json({
      status: "error",
      message: error.message,
      connectionStatus: connectionDetails
    }, { status: 500 });
  }
} 