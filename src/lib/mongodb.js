import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Defina a variável MONGODB_URI nas suas variáveis de ambiente');
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Adicionando timeouts para evitar erros 504 no Vercel
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos para seleção de servidor
      socketTimeoutMS: 45000, // Timeout de 45 segundos para operações de socket (menos que o limite de 50s do Vercel)
      // Otimizações adicionais
      maxPoolSize: 10, // Limitar conexões no pool
      connectTimeoutMS: 10000, // Timeout de conexão
      family: 4 // Força IPv4
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Conexão com MongoDB estabelecida');
        return mongoose;
      })
      .catch((error) => {
        console.error('Erro ao conectar com MongoDB:', error);
        throw error;
      });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default dbConnect; 