'use client';

import Link from 'next/link';
import { FaArrowLeft, FaCalculator, FaTrophy, FaUserGraduate } from 'react-icons/fa';

export default function Sobre() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center mb-8">
        <Link href="/" className="flex items-center text-[var(--primary)] hover:underline">
          <FaArrowLeft className="mr-2" /> Voltar para Início
        </Link>
      </div>
      
      <div className="card mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Sobre</h1>
        
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
            <FaCalculator size={36} />
          </div>
        </div>
        
        <div className="prose mx-auto text-gray-700 space-y-4">
          <p>
            Matemática Divertida é uma plataforma inovadora criada para transformar o ensino da matemática 
            em uma experiência interativa e envolvente. Desenvolvida para a Escola Professor Pedro Teixeira Barroso, 
            a iniciativa visa proporcionar um ambiente dinâmico onde professores e alunos podem explorar 
            conceitos matemáticos de forma lúdica e desafiadora.
          </p>
            
          <p>
            Com jogos, desafios e projetos interdisciplinares, a plataforma incentiva o pensamento lógico, 
            a resolução de problemas e a colaboração entre os participantes. Aqui, a matemática deixa de ser 
            apenas números e fórmulas e se torna uma aventura emocionante no processo de aprendizagem!
          </p>
            
          <p className="text-center font-bold">
            Junte-se a nós e descubra como aprender matemática pode ser divertido e inspirador! 🚀✨
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center p-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] flex items-center justify-center mb-4">
            <FaCalculator size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2">Desafios Interativos</h2>
          <p className="text-gray-600">
            Aprenda matemática através de desafios envolventes que estimulam o raciocínio lógico e a criatividade.
          </p>
        </div>
        
        <div className="card text-center p-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--accent)] bg-opacity-10 text-[var(--accent)] flex items-center justify-center mb-4">
            <FaTrophy size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2">Competições</h2>
          <p className="text-gray-600">
            Participe de rankings e ganhe medalhas enquanto se diverte aprendendo e superando desafios matemáticos.
          </p>
        </div>
        
        <div className="card text-center p-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--secondary)] bg-opacity-10 text-[var(--secondary)] flex items-center justify-center mb-4">
            <FaUserGraduate size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2">Aprendizado Contínuo</h2>
          <p className="text-gray-600">
            Acompanhe seu progresso e desenvolva habilidades matemáticas fundamentais para toda a vida.
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/registro" className="btn-primary inline-flex">
          Comece sua jornada matemática agora!
        </Link>
      </div>
    </div>
  );
} 