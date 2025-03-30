'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalculator, FaTrophy, FaUsers, FaBookOpen } from 'react-icons/fa';

export default function Home() {
  const [status, setStatus] = useState({ 
    loading: true, 
    connected: false, 
    error: null as string | null 
  });

  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        
        setStatus({
          loading: false,
          connected: data.connected,
          error: data.error || null
        });
      } catch (error) {
        setStatus({
          loading: false,
          connected: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
    
    checkConnection();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="animated-bg py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Matemática Divertida</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Transformando o aprendizado de matemática em uma aventura emocionante para estudantes!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/registro" className="btn-primary text-center">
              Cadastre-se Agora
            </Link>
            <Link href="/desafios" className="btn-secondary text-center">
              Ver Desafios
            </Link>
          </div>
          
          {/* Status da Conexão */}
          <div className="mt-8 text-sm bg-white text-gray-800 p-3 rounded-lg inline-block">
            {status.loading ? (
              <p>Verificando conexão com o banco de dados...</p>
            ) : status.connected ? (
              <p className="text-green-600 font-semibold">✓ Conectado ao MongoDB</p>
            ) : (
              <div>
                <p className="text-red-600 font-semibold">✗ Erro de conexão com o banco de dados</p>
                {status.error && <p className="text-xs mt-1">{status.error}</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--text)]">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white mb-4">
                <FaUsers size={30} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[var(--text)]">Cadastro</h3>
              <p className="text-gray-600">
                Professores e alunos podem se cadastrar facilmente na plataforma para participar das competições.
              </p>
            </div>
            <div className="card flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[var(--secondary)] rounded-full flex items-center justify-center text-white mb-4">
                <FaBookOpen size={30} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[var(--text)]">Desafios</h3>
              <p className="text-gray-600">
                Participe de diversos desafios matemáticos interativos, adequados para diferentes níveis de habilidade.
              </p>
            </div>
            <div className="card flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center text-[var(--text)] mb-4">
                <FaTrophy size={30} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[var(--text)]">Competição</h3>
              <p className="text-gray-600">
                Compare seu desempenho com outros alunos e escolas em um ranking dinâmico e emocionante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--secondary)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-lg">Alunos Ativos</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">100+</h3>
              <p className="text-lg">Desafios Divertidos</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">50+</h3>
              <p className="text-lg">Escolas Participantes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[var(--text)]">Pronto para começar?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-600">
            Junte-se a milhares de estudantes que estão aprendendo matemática de forma divertida e interativa!
          </p>
          <Link href="/registro" className="btn-primary">
            Comece Agora
          </Link>
        </div>
      </section>
    </div>
  );
}
