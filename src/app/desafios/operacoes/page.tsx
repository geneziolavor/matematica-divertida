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
  
  // Componente de carregamento
  if (carregando) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Carregando desafio...</h1>
        <div className="animate-pulse bg-blue-400 h-4 w-32 rounded"></div>
      </div>
    );
  }
  
  // Tela inicial (seleção de dificuldade)
  if (!desafioIniciado) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/desafios" className="text-gray-600 hover:text-gray-900 mr-2">
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold">Desafio de Operações Matemáticas</h1>
        </div>
        
        <div className="card max-w-lg mx-auto p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Escolha a Dificuldade</h2>
          
          <div className="space-y-3 mb-6">
            <button 
              onClick={() => setDificuldade('facil')}
              className={`btn w-full ${dificuldade === 'facil' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
            >
              Fácil (Adição e Subtração)
            </button>
            
            <button 
              onClick={() => setDificuldade('medio')}
              className={`btn w-full ${dificuldade === 'medio' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}`}
            >
              Médio (+ Multiplicação)
            </button>
            
            <button 
              onClick={() => setDificuldade('dificil')}
              className={`btn w-full ${dificuldade === 'dificil' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
            >
              Difícil (+ Divisão)
            </button>
          </div>
          
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              Resolva 20 operações matemáticas o mais rápido possível.
              Quanto mais rápido você responder, mais pontos ganhará!
            </p>
            
            <button 
              onClick={iniciarDesafio}
              className="btn-primary px-8 py-3"
            >
              Iniciar Desafio
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Tela de desafio completo
  if (desafioCompleto) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Desafio Concluído!</h1>
        
        <div className="card max-w-lg mx-auto p-6 text-center">
          <div className="text-5xl mb-4 text-green-500">🏆</div>
          
          <h2 className="text-xl font-bold mb-2">Resultados</h2>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Pontuação</p>
                <p className="text-2xl font-bold">{pontuacao}</p>
              </div>
              <div>
                <p className="text-gray-600">Tempo Total</p>
                <p className="text-2xl font-bold">{formatarTempo(timer)}</p>
              </div>
              <div>
                <p className="text-gray-600">Acertos</p>
                <p className="text-2xl font-bold">{respostasCorretas}/20</p>
              </div>
              <div>
                <p className="text-gray-600">Precisão</p>
                <p className="text-2xl font-bold">{Math.round((respostasCorretas / 20) * 100)}%</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={iniciarDesafio}
              className="btn-primary w-full"
            >
              Jogar Novamente
            </button>
            
            <Link href="/desafios" className="btn-secondary w-full block text-center">
              Voltar para Desafios
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Tela do desafio em andamento
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/desafios" className="text-gray-600 hover:text-gray-900">
          <FaArrowLeft />
        </Link>
        
        <div className="flex items-center">
          <FaClock className="mr-2 text-gray-600" />
          <span className="font-mono">{formatarTempo(timer)}</span>
        </div>
        
        <div className="flex items-center">
          <FaStar className="mr-2 text-yellow-500" />
          <span className="font-bold">{pontuacao}</span>
        </div>
      </div>
      
      <div className="card max-w-lg mx-auto p-6">
        <div className="mb-2 text-center">
          <span className="text-sm text-gray-600">Questão {questoesRespondidas + 1}/20</span>
          <div className="h-2 bg-gray-200 rounded-full mt-1">
            <div 
              className="h-2 bg-blue-500 rounded-full" 
              style={{ width: `${(questoesRespondidas / 20) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {questaoAtual && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {questaoAtual.num1} {questaoAtual.operacao} {questaoAtual.num2} = ?
              </h2>
              
              {feedback && (
                <div 
                  className={`text-white p-2 rounded-md ${
                    feedback === 'correto' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {feedback === 'correto' ? 'Correto!' : 'Incorreto!'}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {questaoAtual.opcoes.map((opcao, index) => (
                <button
                  key={index}
                  onClick={() => verificarResposta(opcao)}
                  className={`btn ${
                    feedback 
                      ? opcao === questaoAtual.resposta 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                      : 'bg-white hover:bg-gray-100'
                  } p-4 text-xl font-bold`}
                  disabled={!!feedback}
                >
                  {opcao}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 