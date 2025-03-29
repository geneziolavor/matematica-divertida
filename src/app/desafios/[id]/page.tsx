'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaClock, FaTrophy, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Tipo para as questões
type Alternativa = {
  id: string;
  texto: string;
};

type Questao = {
  id: number;
  enunciado: string;
  alternativas: Alternativa[];
  respostaCorreta: string;
};

// Dados fictícios de desafios
const desafiosMock = {
  1: {
    id: 1,
    titulo: "Números Primos",
    nivel: "Fácil",
    pontos: 100,
    categoria: "Aritmética",
    tempo: 15 * 60, // 15 minutos em segundos
    descricao: "Descubra e identifique números primos em sequências divertidas.",
    questoes: [
      {
        id: 1,
        enunciado: "Qual dos seguintes números é primo?",
        alternativas: [
          { id: "a", texto: "4" },
          { id: "b", texto: "9" },
          { id: "c", texto: "11" },
          { id: "d", texto: "15" }
        ],
        respostaCorreta: "c"
      },
      {
        id: 2,
        enunciado: "Quantos números primos existem entre 1 e 10?",
        alternativas: [
          { id: "a", texto: "2" },
          { id: "b", texto: "3" },
          { id: "c", texto: "4" },
          { id: "d", texto: "5" }
        ],
        respostaCorreta: "c"
      },
      {
        id: 3,
        enunciado: "Um número primo é divisível por:",
        alternativas: [
          { id: "a", texto: "1 e ele mesmo" },
          { id: "b", texto: "Apenas por ele mesmo" },
          { id: "c", texto: "1, 2 e ele mesmo" },
          { id: "d", texto: "Qualquer número menor que ele" }
        ],
        respostaCorreta: "a"
      }
    ]
  },
  3: {
    id: 3,
    titulo: "Geometria Básica",
    nivel: "Fácil",
    pontos: 100,
    categoria: "Geometria",
    tempo: 15 * 60, // 15 minutos em segundos
    descricao: "Identifique formas geométricas e calcule áreas de figuras planas.",
    questoes: [
      {
        id: 1,
        enunciado: "Qual é a área de um quadrado com lado de 5 cm?",
        alternativas: [
          { id: "a", texto: "20 cm²" },
          { id: "b", texto: "25 cm²" },
          { id: "c", texto: "10 cm²" },
          { id: "d", texto: "15 cm²" }
        ],
        respostaCorreta: "b"
      },
      {
        id: 2,
        enunciado: "Um triângulo equilátero tem todos os lados:",
        alternativas: [
          { id: "a", texto: "Diferentes" },
          { id: "b", texto: "Dois lados iguais" },
          { id: "c", texto: "Iguais" },
          { id: "d", texto: "Perpendiculares" }
        ],
        respostaCorreta: "c"
      }
    ]
  }
};

export default function DesafioPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  
  const [desafio, setDesafio] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [tempoRestante, setTempoRestante] = useState(0);
  const [desafioFinalizado, setDesafioFinalizado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  
  // Buscar dados do desafio
  useEffect(() => {
    const buscarDesafio = async () => {
      // Simulando uma chamada à API
      setTimeout(() => {
        const desafioEncontrado = desafiosMock[id as keyof typeof desafiosMock];
        if (desafioEncontrado) {
          setDesafio(desafioEncontrado);
          setTempoRestante(desafioEncontrado.tempo);
        }
        setCarregando(false);
      }, 800);
    };
    
    buscarDesafio();
  }, [id]);
  
  // Cronômetro regressivo
  useEffect(() => {
    if (!desafio || desafioFinalizado) return;
    
    const timer = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finalizarDesafio();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [desafio, desafioFinalizado]);
  
  // Formatar tempo restante
  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };
  
  // Responder questão
  const responderQuestao = (resposta: string) => {
    setRespostas(prev => ({
      ...prev,
      [questaoAtual]: resposta
    }));
  };
  
  // Navegar para próxima questão
  const proximaQuestao = () => {
    if (questaoAtual < desafio.questoes.length - 1) {
      setQuestaoAtual(prev => prev + 1);
    } else {
      finalizarDesafio();
    }
  };
  
  // Navegar para questão anterior
  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(prev => prev - 1);
    }
  };
  
  // Finalizar desafio
  const finalizarDesafio = () => {
    setDesafioFinalizado(true);
    
    // Calcular pontuação
    let acertos = 0;
    desafio.questoes.forEach((questao: Questao, index: number) => {
      if (respostas[index] === questao.respostaCorreta) {
        acertos++;
      }
    });
    
    const pontosTotal = Math.round((acertos / desafio.questoes.length) * desafio.pontos);
    setPontuacao(pontosTotal);
  };
  
  // Voltar para o dashboard
  const voltarParaDashboard = () => {
    router.push('/dashboard');
  };
  
  if (carregando) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando desafio...</p>
        </div>
      </div>
    );
  }
  
  if (!desafio) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-4">Desafio não encontrado</h1>
          <p className="text-gray-600 mb-6">O desafio que você está procurando não existe ou não está disponível.</p>
          <Link href="/dashboard" className="btn-primary">
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  // Tela de resultados
  if (desafioFinalizado) {
    const acertos = desafio.questoes.reduce((total: number, questao: Questao, index: number) => {
      return total + (respostas[index] === questao.respostaCorreta ? 1 : 0);
    }, 0);
    
    const percentualAcerto = Math.round((acertos / desafio.questoes.length) * 100);
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--primary)] text-white text-3xl mb-4">
              {percentualAcerto >= 70 ? '🎉' : percentualAcerto >= 40 ? '😊' : '😔'}
            </div>
            <h1 className="text-2xl font-bold mb-2">Desafio Concluído!</h1>
            <p className="text-gray-600">
              Você completou o desafio <span className="font-semibold">{desafio.titulo}</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">{acertos}/{desafio.questoes.length}</div>
              <div className="text-sm text-gray-600">Questões Corretas</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">{percentualAcerto}%</div>
              <div className="text-sm text-gray-600">Taxa de Acerto</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">{pontuacao}</div>
              <div className="text-sm text-gray-600">Pontos Ganhos</div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Resumo das Respostas</h2>
            <div className="space-y-3">
              {desafio.questoes.map((questao: Questao, index: number) => (
                <div key={questao.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${respostas[index] === questao.respostaCorreta ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {respostas[index] === questao.respostaCorreta ? <FaCheck size={12} /> : <FaTimes size={12} />}
                    </div>
                    <div>
                      <p className="font-medium">{questao.enunciado}</p>
                      <div className="mt-1 text-sm">
                        <p className="text-gray-600">
                          Sua resposta: {questao.alternativas.find(alt => alt.id === respostas[index])?.texto || "Não respondida"}
                        </p>
                        {respostas[index] !== questao.respostaCorreta && (
                          <p className="text-green-600">
                            Resposta correta: {questao.alternativas.find(alt => alt.id === questao.respostaCorreta)?.texto}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Link href={`/desafios/${id}`} className="btn-secondary">
              Tentar Novamente
            </Link>
            <button onClick={voltarParaDashboard} className="btn-primary">
              Voltar ao Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Tela do desafio
  const questao = desafio.questoes[questaoAtual];
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="flex items-center text-[var(--primary)] hover:underline">
          <FaArrowLeft className="mr-2" /> Voltar
        </Link>
        <div className="flex items-center">
          <FaClock className="text-[var(--primary)] mr-2" />
          <span className={`font-mono font-medium ${tempoRestante < 60 ? 'text-red-500 animate-pulse' : ''}`}>
            {formatarTempo(tempoRestante)}
          </span>
        </div>
      </div>
      
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{desafio.titulo}</h1>
          <div className="flex items-center">
            <FaTrophy className="text-[var(--primary)] mr-2" />
            <span className="font-medium">{desafio.pontos} pontos</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-gray-600">
            Questão {questaoAtual + 1} de {desafio.questoes.length}
          </div>
          <div className="bg-gray-100 h-2 flex-grow mx-4 rounded-full overflow-hidden">
            <div 
              className="bg-[var(--primary)] h-full"
              style={{ width: `${((questaoAtual + 1) / desafio.questoes.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-6">{questao.enunciado}</h2>
          
          <div className="space-y-3">
            {questao.alternativas.map((alternativa: Alternativa) => (
              <div 
                key={alternativa.id}
                onClick={() => responderQuestao(alternativa.id)}
                className={`border p-4 rounded-lg cursor-pointer transition-all ${
                  respostas[questaoAtual] === alternativa.id 
                    ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-5' 
                    : 'border-gray-200 hover:border-[var(--primary)]'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                    respostas[questaoAtual] === alternativa.id 
                      ? 'bg-[var(--primary)] border-[var(--primary)] text-white' 
                      : 'border-gray-300'
                  }`}>
                    {respostas[questaoAtual] === alternativa.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span>{alternativa.texto}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={questaoAnterior}
            disabled={questaoAtual === 0}
            className={`px-6 py-2 rounded-lg ${
              questaoAtual === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Anterior
          </button>
          
          <button 
            onClick={proximaQuestao}
            className="btn-primary"
          >
            {questaoAtual < desafio.questoes.length - 1 ? 'Próxima' : 'Finalizar'}
          </button>
        </div>
      </div>
    </div>
  );
} 