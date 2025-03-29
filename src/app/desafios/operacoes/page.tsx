'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaCalculator, 
  FaClock, 
  FaStar, 
  FaCheck, 
  FaTimes,
  FaVolumeMute,
  FaVolumeUp,
  FaTrophy,
  FaPlay
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

type Operacao = '+' | '-' | '*' | '/';
type Dificuldade = 'facil' | 'medio' | 'dificil';

interface Questao {
  num1: number;
  num2: number;
  operacao: Operacao;
  resposta: number;
  opcoes: number[];
}

export default function DesafioOperacoes() {
  const [iniciado, setIniciado] = useState(false);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [tempo, setTempo] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [respostaEscolhida, setRespostaEscolhida] = useState<number | null>(null);
  const [respostaCorreta, setRespostaCorreta] = useState(false);
  const [proximaQuestaoTimeout, setProximaQuestaoTimeout] = useState<NodeJS.Timeout | null>(null);
  const [completo, setCompleto] = useState(false);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil');
  const [totalQuestoes] = useState(20);

  const audioAcertoRef = useRef<HTMLAudioElement | null>(null);
  const audioErroRef = useRef<HTMLAudioElement | null>(null);
  const audioFinalRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Inicializar áudios
  useEffect(() => {
    audioAcertoRef.current = new Audio('/sons/acerto.mp3');
    audioErroRef.current = new Audio('/sons/erro.mp3');
    audioFinalRef.current = new Audio('/sons/final.mp3');

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (proximaQuestaoTimeout) clearTimeout(proximaQuestaoTimeout);
    };
  }, [proximaQuestaoTimeout]);

  // Gerar questões aleatórias
  const gerarQuestoes = () => {
    const novasQuestoes: Questao[] = [];
    const operacoes: Operacao[] = ['+', '-', '*', '/'];
    
    for (let i = 0; i < totalQuestoes; i++) {
      const operacao = operacoes[Math.floor(Math.random() * operacoes.length)];
      let num1, num2, resposta;
      
      // Gerar números com base na dificuldade
      if (dificuldade === 'facil') {
        if (operacao === '+' || operacao === '-') {
          num1 = Math.floor(Math.random() * 90) + 10; // 10-99
          num2 = Math.floor(Math.random() * 90) + 10; // 10-99
        } else if (operacao === '*') {
          num1 = Math.floor(Math.random() * 9) + 2; // 2-10
          num2 = Math.floor(Math.random() * 9) + 2; // 2-10
        } else { // Divisão
          num2 = Math.floor(Math.random() * 9) + 2; // 2-10
          resposta = Math.floor(Math.random() * 9) + 2; // 2-10
          num1 = num2 * resposta; // Garantir divisão exata
        }
      } else if (dificuldade === 'medio') {
        if (operacao === '+' || operacao === '-') {
          num1 = Math.floor(Math.random() * 900) + 100; // 100-999
          num2 = Math.floor(Math.random() * 900) + 100; // 100-999
        } else if (operacao === '*') {
          num1 = Math.floor(Math.random() * 90) + 10; // 10-99
          num2 = Math.floor(Math.random() * 9) + 2; // 2-10
        } else { // Divisão
          num2 = Math.floor(Math.random() * 9) + 2; // 2-10
          resposta = Math.floor(Math.random() * 90) + 10; // 10-99
          num1 = num2 * resposta; // Garantir divisão exata
        }
      } else { // Difícil
        if (operacao === '+' || operacao === '-') {
          num1 = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
          num2 = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
        } else if (operacao === '*') {
          num1 = Math.floor(Math.random() * 90) + 10; // 10-99
          num2 = Math.floor(Math.random() * 90) + 10; // 10-99
        } else { // Divisão
          num2 = Math.floor(Math.random() * 90) + 10; // 10-99
          resposta = Math.floor(Math.random() * 9) + 2; // 2-10
          num1 = num2 * resposta; // Garantir divisão exata
        }
      }
      
      // Se é divisão, já temos resposta, senão calculamos
      if (operacao !== '/' || !resposta) {
        resposta = calcularResposta(num1, num2, operacao);
      }
      
      // Gerar opções (1 correta + 3 incorretas)
      const opcoes = gerarOpcoes(resposta, operacao);
      
      novasQuestoes.push({
        num1,
        num2,
        operacao,
        resposta,
        opcoes
      });
    }
    
    setQuestoes(novasQuestoes);
  };

  // Calcular resposta correta
  const calcularResposta = (num1: number, num2: number, operacao: Operacao): number => {
    switch (operacao) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num1 * num2;
      case '/':
        return Math.round(num1 / num2);
      default:
        return 0;
    }
  };

  // Gerar opções de resposta (1 correta + 3 incorretas)
  const gerarOpcoes = (resposta: number, operacao: Operacao): number[] => {
    const opcoes: number[] = [resposta];
    
    // Gerar variações da resposta correta
    for (let i = 0; i < 3; i++) {
      let opcaoIncorreta;
      do {
        // Variação depende da operação e magnitude da resposta
        const variacao = Math.max(1, Math.floor(Math.abs(resposta) * 0.2));
        const sinal = Math.random() > 0.5 ? 1 : -1;
        
        if (operacao === '+' || operacao === '-') {
          opcaoIncorreta = resposta + sinal * (Math.floor(Math.random() * variacao) + 1);
        } else if (operacao === '*') {
          opcaoIncorreta = resposta + sinal * (Math.floor(Math.random() * variacao) + 1);
        } else { // Divisão
          opcaoIncorreta = resposta + sinal * (Math.floor(Math.random() * 3) + 1);
        }
      } while (opcoes.includes(opcaoIncorreta));
      
      opcoes.push(opcaoIncorreta);
    }
    
    // Embaralhar opções
    return opcoes.sort(() => Math.random() - 0.5);
  };

  // Iniciar desafio
  const iniciarDesafio = () => {
    gerarQuestoes();
    setQuestaoAtual(0);
    setAcertos(0);
    setTempo(0);
    setIniciado(true);
    setCompleto(false);
    setRespostaEscolhida(null);
    setRespostaCorreta(false);
    
    // Iniciar cronômetro
    intervalRef.current = setInterval(() => {
      setTempo(prevTempo => prevTempo + 1);
    }, 1000);
  };

  // Verificar resposta
  const verificarResposta = (opcao: number) => {
    if (respostaEscolhida !== null) return; // Já respondeu, aguardando próxima questão
    
    const correta = opcao === questoes[questaoAtual].resposta;
    setRespostaEscolhida(opcao);
    setRespostaCorreta(correta);
    
    // Tocar som
    if (soundEnabled) {
      if (correta) {
        audioAcertoRef.current?.play();
      } else {
        audioErroRef.current?.play();
      }
    }
    
    // Incrementar acertos
    if (correta) {
      setAcertos(prevAcertos => prevAcertos + 1);
    }
    
    // Avançar para próxima questão após 1.5 segundo
    const timeout = setTimeout(() => {
      if (questaoAtual < questoes.length - 1) {
        setQuestaoAtual(prevQuestao => prevQuestao + 1);
        setRespostaEscolhida(null);
      } else {
        // Desafio completo
        if (intervalRef.current) clearInterval(intervalRef.current);
        setCompleto(true);
        if (soundEnabled) {
          audioFinalRef.current?.play();
        }
        
        // Salvar progresso (em uma aplicação real, enviaria para backend)
        const progresso = {
          dificuldade,
          acertos,
          tempoTotal: tempo,
          data: new Date().toISOString()
        };
        
        console.log('Progresso salvo:', progresso);
        
        // Em uma aplicação real: salvarProgresso(progresso);
      }
    }, 1500);
    
    setProximaQuestaoTimeout(timeout);
  };

  // Formatar tempo
  const formatarTempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segsRestantes.toString().padStart(2, '0')}`;
  };

  // Simbolo da operação
  const simboloOperacao = (operacao: Operacao): string => {
    switch (operacao) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/desafios" className="flex items-center text-[var(--primary)] hover:underline">
          <FaArrowLeft className="mr-2" /> Voltar para Desafios
        </Link>
        
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label={soundEnabled ? "Desativar som" : "Ativar som"}
        >
          {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
      </div>
      
      {/* Tela inicial */}
      {!iniciado && !completo && (
        <div className="card text-center py-8">
          <h1 className="text-3xl font-bold mb-6">Desafio de Operações Matemáticas</h1>
          
          <div className="mb-8">
            <FaCalculator className="text-[var(--primary)] text-6xl mx-auto mb-4" />
            <p className="text-lg text-gray-700 mb-6">
              Teste suas habilidades com as quatro operações matemáticas básicas!
              Resolva {totalQuestoes} questões o mais rápido possível.
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <h2 className="text-xl font-bold mb-3">Selecione a dificuldade:</h2>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setDificuldade('facil')} 
                  className={`px-4 py-2 rounded-lg ${dificuldade === 'facil' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100'}`}
                >
                  Fácil
                </button>
                <button 
                  onClick={() => setDificuldade('medio')} 
                  className={`px-4 py-2 rounded-lg ${dificuldade === 'medio' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100'}`}
                >
                  Médio
                </button>
                <button 
                  onClick={() => setDificuldade('dificil')} 
                  className={`px-4 py-2 rounded-lg ${dificuldade === 'dificil' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100'}`}
                >
                  Difícil
                </button>
              </div>
            </div>
            
            <button 
              onClick={iniciarDesafio} 
              className="btn-primary inline-flex items-center text-lg px-8 py-3"
            >
              <FaPlay className="mr-2" /> Iniciar Desafio
            </button>
          </div>
          
          <div className="bg-[var(--accent)] bg-opacity-10 max-w-md mx-auto p-4 rounded-lg">
            <h3 className="font-bold mb-2">Como jogar:</h3>
            <ul className="text-left text-sm space-y-2">
              <li>• Resolva {totalQuestoes} questões matemáticas</li>
              <li>• Escolha a resposta correta entre 4 opções</li>
              <li>• Seja rápido! O tempo está sendo contado</li>
              <li>• Ao final, veja seu desempenho</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Desafio em andamento */}
      {iniciado && !completo && questoes.length > 0 && (
        <div className="card">
          {/* Barra de progresso e cronômetro */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 flex items-center">
              <div className="font-bold text-lg mr-4">
                {questaoAtual + 1}/{totalQuestoes}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-[var(--primary)] h-2.5 rounded-full" 
                  style={{ width: `${((questaoAtual + 1) / totalQuestoes) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="ml-6 bg-gray-100 px-4 py-2 rounded-lg flex items-center">
              <FaClock className="mr-2 text-[var(--primary)]" />
              <span className="font-mono font-bold">{formatarTempo(tempo)}</span>
            </div>
          </div>
          
          {/* Questão atual */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)] text-white font-bold text-xl mb-4">
              {questaoAtual + 1}
            </div>
            
            <div className="text-4xl font-bold mb-8 flex items-center justify-center">
              <span>{questoes[questaoAtual].num1}</span>
              <span className="mx-4 text-[var(--accent)]">
                {simboloOperacao(questoes[questaoAtual].operacao)}
              </span>
              <span>{questoes[questaoAtual].num2}</span>
              <span className="mx-4">=</span>
              <span className="text-[var(--primary)]">?</span>
            </div>
            
            {/* Opções de resposta */}
            <div className="grid grid-cols-2 gap-4">
              {questoes[questaoAtual].opcoes.map((opcao, index) => (
                <button
                  key={index}
                  onClick={() => verificarResposta(opcao)}
                  className={`
                    p-4 text-xl font-bold rounded-lg transition-colors
                    ${respostaEscolhida === null 
                      ? 'bg-white border-2 border-gray-200 hover:border-[var(--primary)]' 
                      : respostaEscolhida === opcao 
                        ? (respostaCorreta ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500')
                        : opcao === questoes[questaoAtual].resposta && respostaEscolhida !== null
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-white border-2 border-gray-200 opacity-60'
                    }
                  `}
                  disabled={respostaEscolhida !== null}
                >
                  {opcao}
                  {respostaEscolhida !== null && opcao === questoes[questaoAtual].resposta && (
                    <FaCheck className="inline-block ml-2 text-green-600" />
                  )}
                  {respostaEscolhida === opcao && opcao !== questoes[questaoAtual].resposta && (
                    <FaTimes className="inline-block ml-2 text-red-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Dica */}
          <div className="text-center text-sm text-gray-500">
            Selecione a resposta correta para continuar
          </div>
        </div>
      )}
      
      {/* Tela de resultado */}
      {completo && (
        <div className="card text-center py-8">
          <h1 className="text-3xl font-bold mb-6">Desafio Concluído!</h1>
          
          <div className="mb-8">
            <FaTrophy className="text-yellow-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">Parabéns!</h2>
            <p className="text-lg text-gray-700 mb-6">
              Você completou o desafio de Operações Matemáticas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-[var(--primary)] bg-opacity-10 p-4 rounded-lg">
              <div className="text-3xl font-bold text-[var(--primary)]">{acertos}</div>
              <div className="text-sm text-gray-600">Acertos</div>
            </div>
            <div className="bg-[var(--accent)] bg-opacity-10 p-4 rounded-lg">
              <div className="text-3xl font-bold text-[var(--accent)]">{totalQuestoes - acertos}</div>
              <div className="text-sm text-gray-600">Erros</div>
            </div>
            <div className="bg-[var(--secondary)] bg-opacity-10 p-4 rounded-lg">
              <div className="text-3xl font-bold text-[var(--secondary)]">{formatarTempo(tempo)}</div>
              <div className="text-sm text-gray-600">Tempo</div>
            </div>
          </div>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Pontuação:</h3>
              <div className="text-4xl font-bold text-[var(--primary)]">
                {Math.round(acertos * 100 - tempo * 0.5)}
              </div>
              <div className="text-sm text-gray-600">
                Cálculo: (acertos × 100) - (tempo × 0.5)
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">Taxa de acertos:</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-[var(--primary)] h-4 rounded-full" 
                  style={{ width: `${(acertos / totalQuestoes) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {Math.round((acertos / totalQuestoes) * 100)}% de acertos
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => iniciarDesafio()} 
                className="btn-primary w-full"
              >
                Tentar Novamente
              </button>
              <Link href="/desafios" className="btn-secondary block w-full">
                Outros Desafios
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 