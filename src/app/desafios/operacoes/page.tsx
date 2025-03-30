'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaClock, FaStar } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Tipos
type Dificuldade = 'facil' | 'medio' | 'dificil';
type Operacao = '+' | '-' | '*' | '/';

interface Questao {
  num1: number;
  num2: number;
  operacao: Operacao;
  resposta: number;
  opcoes: number[];
}

// Componente principal
export default function DesafioOperacoes() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  // Estados
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil');
  const [desafioIniciado, setDesafioIniciado] = useState(false);
  const [questaoAtual, setQuestaoAtual] = useState<Questao | null>(null);
  const [questoesRespondidas, setQuestoesRespondidas] = useState(0);
  const [respostasCorretas, setRespostasCorretas] = useState(0);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState<'correto' | 'incorreto' | null>(null);
  const [pontuacao, setPontuacao] = useState(0);
  const [desafioCompleto, setDesafioCompleto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  
  // Referências para áudio (serão inicializadas apenas no cliente)
  const audioAcerto = useRef<HTMLAudioElement | null>(null);
  const audioErro = useRef<HTMLAudioElement | null>(null);
  const audioFinal = useRef<HTMLAudioElement | null>(null);
  
  // Inicializar elementos de áudio no lado do cliente
  useEffect(() => {
    // Garantir que estamos no lado do cliente
    setCarregando(false);
    
    // Inicializar elementos de áudio
    try {
      audioAcerto.current = new Audio('/sons/acerto.mp3');
      audioErro.current = new Audio('/sons/erro.mp3');
      audioFinal.current = new Audio('/sons/final.mp3');
    } catch (error) {
      console.error('Erro ao carregar arquivos de áudio:', error);
    }
    
    // Verificar autenticação
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  // Efeito para o timer quando o desafio está em andamento
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (desafioIniciado && !desafioCompleto) {
      intervalId = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [desafioIniciado, desafioCompleto]);
  
  // Função para gerar uma nova questão baseada na dificuldade
  const gerarQuestao = (): Questao => {
    // Definir limites com base na dificuldade
    const limites = {
      facil: { min: 1, max: 10, ops: ['+', '-'] as Operacao[] },
      medio: { min: 1, max: 25, ops: ['+', '-', '*'] as Operacao[] },
      dificil: { min: 1, max: 50, ops: ['+', '-', '*', '/'] as Operacao[] }
    };
    
    const { min, max, ops } = limites[dificuldade];
    let num1: number, num2: number, operacao: Operacao, resposta: number;
    
    // Gerar números e operação aleatórios
    operacao = ops[Math.floor(Math.random() * ops.length)];
    
    // Garantir que divisões resultem em números inteiros
    if (operacao === '/') {
      num2 = Math.floor(Math.random() * (max - min) + min);
      // Multiplicar primeiro para garantir resultado inteiro na divisão
      resposta = Math.floor(Math.random() * (max - min) + min);
      num1 = num2 * resposta;
    } else {
      num1 = Math.floor(Math.random() * (max - min) + min);
      num2 = Math.floor(Math.random() * (max - min) + min);
      
      // Se for subtração, garantir resultado positivo
      if (operacao === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
      }
      
      // Calcular resposta
      switch (operacao) {
        case '+': resposta = num1 + num2; break;
        case '-': resposta = num1 - num2; break;
        case '*': resposta = num1 * num2; break;
        default: resposta = num1 / num2; // Já garantimos que é inteiro
      }
    }
    
    // Gerar opções (incluindo a resposta correta)
    const opcoes = [resposta];
    
    // Gerar 3 respostas incorretas próximas à resposta correta
    while (opcoes.length < 4) {
      const offset = Math.floor(Math.random() * 10) + 1;
      const sinal = Math.random() > 0.5 ? 1 : -1;
      const opcao = resposta + (offset * sinal);
      
      // Evitar opções negativas e duplicadas
      if (opcao > 0 && !opcoes.includes(opcao)) {
        opcoes.push(opcao);
      }
    }
    
    // Embaralhar opções
    return {
      num1,
      num2,
      operacao,
      resposta,
      opcoes: opcoes.sort(() => Math.random() - 0.5)
    };
  };
  
  // Iniciar desafio
  const iniciarDesafio = () => {
    setDesafioIniciado(true);
    setQuestaoAtual(gerarQuestao());
    setQuestoesRespondidas(0);
    setRespostasCorretas(0);
    setPontuacao(0);
    setTimer(0);
    setDesafioCompleto(false);
  };
  
  // Verificar resposta
  const verificarResposta = (resposta: number) => {
    if (!questaoAtual) return;
    
    const isCorreto = resposta === questaoAtual.resposta;
    
    // Atualizar estatísticas
    if (isCorreto) {
      // Calcular pontos (baseado na dificuldade e tempo)
      const pontosDificuldade = {
        facil: 10,
        medio: 20,
        dificil: 30
      };
      
      // Bônus por resposta rápida
      const tempoBonus = Math.max(0, 5 - Math.floor(timer / 5));
      const pontos = pontosDificuldade[dificuldade] + tempoBonus;
      
      setRespostasCorretas(prev => prev + 1);
      setPontuacao(prev => prev + pontos);
      setFeedback('correto');
      
      // Tocar som de acerto
      if (audioAcerto.current) {
        audioAcerto.current.play().catch(err => console.error('Erro ao tocar áudio:', err));
      }
    } else {
      setFeedback('incorreto');
      
      // Tocar som de erro
      if (audioErro.current) {
        audioErro.current.play().catch(err => console.error('Erro ao tocar áudio:', err));
      }
    }
    
    // Passar para próxima questão após 1 segundo
    setTimeout(() => {
      setQuestoesRespondidas(prev => prev + 1);
      setFeedback(null);
      
      // Verificar se completou 20 questões
      if (questoesRespondidas + 1 >= 20) {
        finalizarDesafio();
      } else {
        setQuestaoAtual(gerarQuestao());
      }
    }, 1000);
  };
  
  // Finalizar desafio
  const finalizarDesafio = () => {
    setDesafioCompleto(true);
    
    // Tocar som final
    if (audioFinal.current) {
      audioFinal.current.play().catch(err => console.error('Erro ao tocar áudio final:', err));
    }
    
    // Salvar pontuação (versão simplificada)
    try {
      // Registrar pontuação no localStorage como fallback
      const pontuacoes = JSON.parse(localStorage.getItem('pontuacoes') || '[]');
      pontuacoes.push({
        userId: user?.id || 'anonimo',
        nome: user?.nome || 'Usuário Anônimo',
        desafioId: 'operacoes',
        pontuacao: pontuacao,
        data: new Date().toISOString()
      });
      localStorage.setItem('pontuacoes', JSON.stringify(pontuacoes));
      
      // Se estamos online, tentamos salvar no servidor
      if (typeof window !== 'undefined' && navigator.onLine) {
        fetch('/api/pontuacoes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user?.id || 'anonimo',
            desafioId: 'operacoes',
            pontos: pontuacao,
            tempoConcluido: timer
          })
        })
        .then(res => {
          if (!res.ok) throw new Error('Erro ao salvar pontuação');
          return res.json();
        })
        .then(data => console.log('Pontuação salva com sucesso:', data))
        .catch(err => console.error('Erro ao salvar pontuação:', err));
      }
    } catch (error) {
      console.error('Erro ao salvar pontuação:', error);
    }
  };
  
  // Helper para formatar o tempo (mm:ss)
  const formatarTempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };
  
  // Renderização do componente
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/desafios" className="flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" />
            <span>Voltar aos desafios</span>
          </Link>
          <div className="flex items-center text-gray-700">
            <FaClock className="mr-2 text-blue-600" />
            <span className="font-mono text-lg font-bold">{formatarTempo(timer)}</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="mb-8 text-center text-3xl font-bold text-indigo-700 md:text-4xl">
          Desafio de Operações Matemáticas
        </h1>

        {carregando ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-600"></div>
          </div>
        ) : desafioCompleto ? (
          /* Tela de conclusão do desafio */
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <FaStar className="h-10 w-10 text-yellow-500" />
                </div>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-indigo-700">Parabéns!</h2>
              <p className="text-lg text-gray-700">Você completou o desafio de operações matemáticas!</p>
            </div>

            <div className="mb-6 space-y-4 rounded-lg bg-indigo-50 p-4">
              <div className="flex justify-between border-b border-indigo-100 pb-2">
                <span className="font-medium">Respostas corretas:</span>
                <span className="font-bold text-green-600">{respostasCorretas} / 20</span>
              </div>
              <div className="flex justify-between border-b border-indigo-100 pb-2">
                <span className="font-medium">Pontuação:</span>
                <span className="font-bold text-blue-600">{pontuacao} pontos</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tempo total:</span>
                <span className="font-mono font-bold text-purple-600">{formatarTempo(timer)}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={iniciarDesafio}
                className="w-full rounded-lg bg-indigo-600 py-3 text-lg font-semibold text-white transition-all hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
              >
                Jogar novamente
              </button>
              <Link
                href="/desafios"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 text-center text-lg font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:ring-4 focus:ring-gray-200"
              >
                Voltar aos desafios
              </Link>
            </div>
          </div>
        ) : !desafioIniciado ? (
          /* Tela inicial para selecionar dificuldade */
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-bold text-indigo-700">Escolha a dificuldade</h2>
            
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {(['facil', 'medio', 'dificil'] as Dificuldade[]).map((nivel) => (
                <button
                  key={nivel}
                  onClick={() => setDificuldade(nivel)}
                  className={`rounded-lg px-6 py-4 text-lg font-bold transition-all ${
                    dificuldade === nivel
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {nivel === 'facil' ? 'Fácil' : nivel === 'medio' ? 'Médio' : 'Difícil'}
                </button>
              ))}
            </div>
            
            <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-gray-700">
              <h3 className="mb-2 font-bold text-blue-700">Detalhes da dificuldade:</h3>
              {dificuldade === 'facil' && (
                <p>Números de 1 a 10 com operações de adição e subtração.</p>
              )}
              {dificuldade === 'medio' && (
                <p>Números de 1 a 25 com operações de adição, subtração e multiplicação.</p>
              )}
              {dificuldade === 'dificil' && (
                <p>Números de 1 a 50 com todas as operações (adição, subtração, multiplicação e divisão).</p>
              )}
            </div>
            
            <button
              onClick={iniciarDesafio}
              className="w-full rounded-lg bg-green-600 py-3 text-lg font-semibold text-white transition-all hover:bg-green-700 focus:ring-4 focus:ring-green-300"
            >
              Iniciar Desafio
            </button>
          </div>
        ) : (
          /* Tela do desafio em andamento */
          <div className="rounded-xl bg-white p-6 shadow-lg">
            {/* Progresso */}
            <div className="mb-6">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Questão {questoesRespondidas + 1} de 20</span>
                <span className="text-sm font-medium text-gray-600">Corretas: {respostasCorretas}</span>
              </div>
              <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-indigo-600"
                  style={{ width: `${(questoesRespondidas / 20) * 100}%` }}
                ></div>
              </div>
            </div>

            {questaoAtual && (
              <>
                {/* Questão */}
                <div 
                  className="mb-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center shadow-lg"
                >
                  <div className="mb-4 text-xl font-bold text-white md:text-2xl">
                    <span className="inline-block animate-fadeInUp transform transition-all">Quanto é</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-6 inline-block rounded-xl bg-white p-6 shadow-md">
                      <span className="text-3xl font-bold text-gray-800 md:text-5xl">
                        {questaoAtual.num1} {questaoAtual.operacao} {questaoAtual.num2}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Opções de resposta */}
                <div className="grid grid-cols-2 gap-4">
                  {questaoAtual.opcoes.map((opcao, index) => (
                    <button
                      key={index}
                      onClick={() => verificarResposta(opcao)}
                      className={`
                        relative overflow-hidden rounded-lg py-4 text-xl font-bold shadow-md transition-all
                        ${
                          feedback 
                            ? opcao === questaoAtual.resposta
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                            : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                        }
                      `}
                      disabled={feedback !== null}
                    >
                      {opcao}
                      {feedback && opcao === questaoAtual.resposta && (
                        <span className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-20">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Feedback visual */}
                {feedback && (
                  <div className={`
                    mt-6 rounded-lg px-4 py-3 text-center text-lg font-bold
                    ${feedback === 'correto' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  `}>
                    {feedback === 'correto' ? 'Resposta correta! 👍' : 'Resposta incorreta. 😢'}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 