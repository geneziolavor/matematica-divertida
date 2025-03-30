'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaClock, 
  FaStar, 
  FaTrophy, 
  FaCheck,
  FaTimes,
  FaChalkboardTeacher 
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

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

type Desafio = {
  id: number | string;
  titulo: string;
  categoria: string;
  nivel: string;
  pontos: number;
  tempo: number;
  descricao: string;
  questoes: Questao[];
  professorId?: string;
  criadoEm?: string;
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
  const { user, isLoading } = useAuth();
  
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [tempoCorrido, setTempoCorrido] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [desafioIniciado, setDesafioIniciado] = useState(false);
  const [desafioFinalizado, setDesafioFinalizado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [carregando, setCarregando] = useState(true);
  
  // Carregar dados do desafio
  useEffect(() => {
    console.log("Carregando dados do desafio");
    
    if (!isLoading && !user) {
      console.log("Usuário não autenticado, redirecionando para login");
      router.push('/login');
      return;
    }
    
    const id = params?.id;
    console.log("ID do desafio:", id);
    
    if (!id) {
      console.log("ID não fornecido");
      setCarregando(false);
      return;
    }
    
    // Primeiro verificar se é um ID numérico para desafios do sistema
    const idNumerico = parseInt(id as string, 10);
    const isNumericId = !isNaN(idNumerico);
    
    console.log("ID é numérico:", isNumericId, "Valor numérico:", idNumerico);
    
    // Verificando se é um desafio do sistema
    const desafioSistema = isNumericId ? desafiosMock[idNumerico as keyof typeof desafiosMock] : null;
    console.log("Desafio do sistema encontrado:", desafioSistema ? "Sim" : "Não");
    
    if (desafioSistema) {
      console.log("Usando desafio do sistema:", desafioSistema.titulo);
      setDesafio(desafioSistema);
      setCarregando(false);
      return;
    }
    
    // Se não for do sistema, buscar nos desafios do professor
    try {
      console.log("Verificando desafios do professor");
      const desafiosProfessor = localStorage.getItem('desafiosProfessor');
      console.log("Valor bruto do localStorage:", desafiosProfessor ? "Encontrado" : "Não encontrado");
      
      // Se não tiver desafios de professor, verificar se tem um backup
      if (!desafiosProfessor) {
        const backup = localStorage.getItem('desafiosProfessor_backup');
        if (backup) {
          console.log("Usando backup dos desafios");
          localStorage.setItem('desafiosProfessor', backup);
        }
      }
      
      // Criar um desafio de exemplo se não encontrar nada
      if (!desafiosProfessor && !localStorage.getItem('desafiosProfessor_backup')) {
        console.log("Criando desafio de exemplo temporário");
        const desafioTeste = {
          id: id.toString(),
          titulo: "Desafio Temporário",
          categoria: "Teste",
          nivel: "Médio",
          pontos: 200,
          tempo: 10 * 60,
          descricao: "Este é um desafio temporário criado como fallback.",
          questoes: [
            {
              id: 1,
              enunciado: "Quanto é 2 + 2?",
              alternativas: [
                { id: "a", texto: "3" },
                { id: "b", texto: "4" },
                { id: "c", texto: "5" },
                { id: "d", texto: "6" }
              ],
              respostaCorreta: "b"
            }
          ]
        };
        
        const desafiosTemporarios = [desafioTeste];
        localStorage.setItem('desafiosProfessor_temp', JSON.stringify(desafiosTemporarios));
        setDesafio(desafioTeste);
        setCarregando(false);
        return;
      }
      
      // Tentar processar os desafios do professor
      if (desafiosProfessor) {
        try {
          const desafiosParsed = JSON.parse(desafiosProfessor);
          console.log("Total de desafios do professor:", Array.isArray(desafiosParsed) ? desafiosParsed.length : "Não é array");
          
          // Verificar se desafiosParsed é um array
          if (!Array.isArray(desafiosParsed)) {
            throw new Error("Formato inválido de desafios");
          }
          
          // Mapear todos os IDs para depuração
          console.log("IDs disponíveis:", desafiosParsed.map((d: any) => typeof d.id === 'undefined' ? 'undefined' : d.id.toString()));
          
          const desafioEncontrado = desafiosParsed.find((d: any) => {
            if (!d || typeof d.id === 'undefined') return false;
            return d.id.toString() === id.toString();
          });
          
          console.log("Desafio do professor encontrado:", desafioEncontrado ? "Sim" : "Não");
          
          if (desafioEncontrado) {
            console.log("Usando desafio do professor:", desafioEncontrado.titulo);
            setDesafio(desafioEncontrado);
            setCarregando(false);
          } else {
            console.log("Desafio não encontrado, criando fallback");
            // Criar desafio básico como fallback
            const desafioFallback = {
              id: id.toString(),
              titulo: "Desafio " + id,
              categoria: "Matemática",
              nivel: "Médio",
              pontos: 100,
              tempo: 5 * 60,
              descricao: "Este desafio foi gerado como fallback porque o original não foi encontrado.",
              questoes: [
                {
                  id: 1,
                  enunciado: "Qual é o resultado de 5 × 7?",
                  alternativas: [
                    { id: "a", texto: "35" },
                    { id: "b", texto: "30" },
                    { id: "c", texto: "40" },
                    { id: "d", texto: "25" }
                  ],
                  respostaCorreta: "a"
                }
              ]
            };
            setDesafio(desafioFallback);
            setCarregando(false);
          }
        } catch (error) {
          console.error('Erro ao processar desafios do professor:', error);
          // Em caso de erro, criar um desafio de emergência
          const desafioEmergencia = {
            id: id.toString(),
            titulo: "Desafio de Emergência",
            categoria: "Recuperação",
            nivel: "Básico",
            pontos: 50,
            tempo: 3 * 60,
            descricao: "Este desafio foi criado porque ocorreu um erro ao carregar o desafio original.",
            questoes: [
              {
                id: 1,
                enunciado: "Quanto é 10 - 5?",
                alternativas: [
                  { id: "a", texto: "5" },
                  { id: "b", texto: "6" },
                  { id: "c", texto: "4" },
                  { id: "d", texto: "7" }
                ],
                respostaCorreta: "a"
              }
            ]
          };
          setDesafio(desafioEmergencia);
          setCarregando(false);
        }
      } else {
        console.log("Nenhum desafio encontrado no localStorage");
        setCarregando(false);
      }
    } catch (error) {
      console.error("Erro geral ao carregar desafio:", error);
      setCarregando(false);
    }
  }, [params?.id, user, isLoading, router]);
  
  // Timer
  useEffect(() => {
    if (!desafioIniciado || desafioFinalizado || !startTime) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setTempoCorrido(diff);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [desafioIniciado, desafioFinalizado, startTime]);
  
  // Iniciar desafio
  const iniciarDesafio = () => {
    setDesafioIniciado(true);
    setStartTime(new Date());
  };
  
  // Selecionar resposta
  const selecionarResposta = (alternativaId: string) => {
    if (desafioFinalizado) return;
    
    const novasRespostas = { ...respostas };
    novasRespostas[questaoAtual] = alternativaId;
    setRespostas(novasRespostas);
  };
  
  // Navegar para próxima questão
  const proximaQuestao = () => {
    if (!desafio) return;
    
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
  const finalizarDesafio = async () => {
    if (!desafio || !user) return;
    
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
    
    try {
      // Salvar no banco de dados
      await fetch('/api/pontuacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          desafioId: desafio.id.toString(),
          pontos: pontosTotal,
          tempoConcluido: tempoCorrido
        })
      });
      
      console.log("Pontuação salva com sucesso:", {
        userId: user.id,
        desafioId: desafio.id.toString(),
        pontos: pontosTotal,
        tempoConcluido: tempoCorrido
      });
      
      // Também salvar no localStorage para compatibilidade
      const progressoDesafios = localStorage.getItem('progressoDesafios') || '{}';
      try {
        const progresso = JSON.parse(progressoDesafios);
        progresso[desafio.id] = {
          userId: user.id,
          completado: true,
          pontuacao: pontosTotal,
          tempoConcluido: tempoCorrido,
          data: new Date().toISOString()
        };
        localStorage.setItem('progressoDesafios', JSON.stringify(progresso));
      } catch (error) {
        console.error('Erro ao salvar progresso local:', error);
      }
    } catch (error) {
      console.error('Erro ao salvar pontuação:', error);
    }
  };
  
  // Voltar para o dashboard
  const voltarParaDashboard = () => {
    router.push('/dashboard');
  };
  
  // Formatar tempo
  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
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
  
  // Verificar se o usuário tem acesso
  if (!desafioIniciado) {
    // Tela de início do desafio
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/desafios" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <FaArrowLeft className="mr-2" /> Voltar para Desafios
        </Link>
        
        <div className="card">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{desafio.titulo}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <span className="flex items-center mr-4">
                <FaStar className="text-[var(--accent)] mr-1" /> {desafio.nivel}
              </span>
              <span className="flex items-center mr-4">
                <FaTrophy className="text-[var(--primary)] mr-1" /> {desafio.pontos} pontos
              </span>
              <span className="flex items-center">
                <FaClock className="text-[var(--secondary)] mr-1" /> {Math.floor(desafio.tempo / 60)} minutos
              </span>
              {desafio.professorId && (
                <span className="flex items-center ml-4">
                  <FaChalkboardTeacher className="text-[var(--secondary)] mr-1" /> Criado por Professor
                </span>
              )}
            </div>
            <p className="text-gray-600">{desafio.descricao}</p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="font-bold mb-2">Instruções:</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Este desafio contém {desafio.questoes.length} questões.</li>
              <li>Você tem {Math.floor(desafio.tempo / 60)} minutos para completar.</li>
              <li>Leia cada questão cuidadosamente antes de responder.</li>
              <li>Você pode navegar entre as questões durante o desafio.</li>
              <li>Sua pontuação será baseada em quantas questões você acertar.</li>
            </ul>
          </div>
          
          <div className="flex justify-between">
            <Link href="/desafios" className="btn-secondary">
              Cancelar
            </Link>
            <button onClick={iniciarDesafio} className="btn-primary">
              Iniciar Desafio
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (desafioFinalizado) {
    // Tela de resultado do desafio
    const questoesTotal = desafio.questoes.length;
    const acertos = desafio.questoes.reduce((total, questao, index) => {
      return total + (respostas[index] === questao.respostaCorreta ? 1 : 0);
    }, 0);
    const porcentagemAcertos = Math.round((acertos / questoesTotal) * 100);
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">
              {porcentagemAcertos >= 70 ? "🎉" : porcentagemAcertos >= 50 ? "👍" : "😕"}
            </div>
            <h1 className="text-2xl font-bold mb-2">Desafio Concluído!</h1>
            <p className="text-gray-600">Você completou o desafio "{desafio.titulo}"</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-gray-600 mb-1">Pontuação</p>
              <p className="text-2xl font-bold text-[var(--primary)]">{pontuacao} pontos</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-gray-600 mb-1">Tempo</p>
              <p className="text-2xl font-bold text-[var(--secondary)]">{formatarTempo(tempoCorrido)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-gray-600 mb-1">Acertos</p>
              <p className="text-2xl font-bold text-[var(--accent)]">{acertos}/{questoesTotal} ({porcentagemAcertos}%)</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="font-bold mb-4">Resumo das Questões</h2>
            <div className="space-y-3">
              {desafio.questoes.map((questao, index) => {
                const respondido = respostas[index] !== undefined;
                const correto = respostas[index] === questao.respostaCorreta;
                
                return (
                  <div key={questao.id} className="flex items-center p-3 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      !respondido ? 'bg-gray-200' : (correto ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')
                    }`}>
                      {!respondido ? (index + 1) : correto ? <FaCheck /> : <FaTimes />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Questão {index + 1}</p>
                      {respondido && (
                        <p className="text-sm text-gray-600">
                          {correto ? 'Resposta correta' : `Resposta errada (correta: ${questao.respostaCorreta.toUpperCase()})`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button onClick={voltarParaDashboard} className="btn-secondary">
              Voltar para o Dashboard
            </button>
            <Link href="/desafios" className="btn-primary">
              Mais Desafios
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Tela do desafio em andamento
  const questaoAtualObj = desafio.questoes[questaoAtual];
  const respostaSelecionada = respostas[questaoAtual];
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{desafio.titulo}</h1>
        <div className="flex items-center">
          <div className="bg-[var(--primary)] text-white px-3 py-1 rounded-lg flex items-center">
            <FaClock className="mr-2" />
            {formatarTempo(tempoCorrido)}
          </div>
        </div>
      </div>
      
      <div className="mb-4 bg-gray-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-[var(--primary)] h-full"
          style={{ width: `${((questaoAtual + 1) / desafio.questoes.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="card mb-6">
        <div className="mb-6">
          <span className="inline-block bg-[var(--primary)] text-white px-3 py-1 rounded-lg mb-4">
            Questão {questaoAtual + 1} de {desafio.questoes.length}
          </span>
          <h2 className="text-xl font-medium mb-2">{questaoAtualObj.enunciado}</h2>
        </div>
        
        <div className="space-y-3 mb-6">
          {questaoAtualObj.alternativas.map((alternativa) => (
            <button
              key={alternativa.id}
              className={`w-full text-left p-4 border rounded-lg transition-colors ${
                respostaSelecionada === alternativa.id 
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => selecionarResposta(alternativa.id)}
            >
              <span className="font-bold mr-2">{alternativa.id.toUpperCase()})</span> {alternativa.texto}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={questaoAnterior} 
            className={`btn-secondary ${questaoAtual === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={questaoAtual === 0}
          >
            Anterior
          </button>
          
          <button 
            onClick={proximaQuestao} 
            className="btn-primary"
            disabled={respostaSelecionada === undefined}
          >
            {questaoAtual === desafio.questoes.length - 1 ? 'Finalizar' : 'Próxima'}
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2">
        {desafio.questoes.map((_, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              index === questaoAtual 
                ? 'bg-[var(--primary)] text-white'
                : respostas[index] !== undefined
                ? 'bg-[var(--accent)] text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setQuestaoAtual(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
} 