'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaCalculator, 
  FaTrophy, 
  FaStar, 
  FaLock,
  FaCheck,
  FaRegClock,
  FaFilter,
  FaChalkboardTeacher,
  FaPlus
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Interface para os desafios
interface Desafio {
  id: number | string;
  titulo: string;
  nivel: string;
  pontos: number;
  completado: boolean;
  categoria: string;
  tempo: string;
  descricao: string;
  bloqueado?: boolean;
  criadoPor?: 'sistema' | 'professor';
}

// Dados fictícios de desafios
const desafios: Desafio[] = [
  {
    id: 1,
    titulo: "Números Primos",
    nivel: "Fácil",
    pontos: 100,
    completado: true,
    categoria: "Aritmética",
    tempo: "15 min",
    descricao: "Descubra e identifique números primos em sequências divertidas.",
    criadoPor: 'sistema'
  },
  {
    id: 2,
    titulo: "Frações e Decimais",
    nivel: "Médio",
    pontos: 150,
    completado: true,
    categoria: "Operações",
    tempo: "20 min",
    descricao: "Converta frações em decimais e resolva problemas práticos.",
    criadoPor: 'sistema'
  },
  {
    id: 3,
    titulo: "Geometria Básica",
    nivel: "Fácil",
    pontos: 100,
    completado: false,
    categoria: "Geometria",
    tempo: "15 min",
    descricao: "Identifique formas geométricas e calcule áreas de figuras planas.",
    criadoPor: 'sistema'
  },
  {
    id: 4,
    titulo: "Equações de 1º Grau",
    nivel: "Médio",
    pontos: 200,
    completado: false,
    categoria: "Álgebra",
    tempo: "25 min",
    descricao: "Resolva equações de primeiro grau e aplique em problemas práticos.",
    criadoPor: 'sistema'
  },
  {
    id: 5,
    titulo: "Problemas de Lógica",
    nivel: "Difícil",
    pontos: 300,
    completado: false,
    bloqueado: true,
    categoria: "Lógica",
    tempo: "30 min",
    descricao: "Resolva problemas de lógica matemática que exigem raciocínio avançado.",
    criadoPor: 'sistema'
  },
  {
    id: 6,
    titulo: "Estatística Básica",
    nivel: "Médio",
    pontos: 180,
    completado: false,
    categoria: "Estatística",
    tempo: "20 min",
    descricao: "Aprenda conceitos básicos de média, mediana e moda em conjuntos de dados.",
    criadoPor: 'sistema'
  },
  {
    id: 7,
    titulo: "Probabilidade",
    nivel: "Difícil",
    pontos: 250,
    completado: false,
    categoria: "Probabilidade",
    tempo: "25 min",
    descricao: "Calcule a probabilidade de eventos em situações cotidianas.",
    criadoPor: 'sistema'
  },
  {
    id: 8,
    titulo: "Funções Quadráticas",
    nivel: "Difícil",
    pontos: 280,
    completado: false,
    bloqueado: true,
    categoria: "Álgebra",
    tempo: "30 min",
    descricao: "Explore funções quadráticas e suas aplicações em problemas reais.",
    criadoPor: 'sistema'
  }
];

export default function Desafios() {
  const [filtro, setFiltro] = useState('todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null);
  const [nivelFiltro, setNivelFiltro] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [todosDesafios, setTodosDesafios] = useState(desafios);

  // Carregar desafios criados por professores
  useEffect(() => {
    // Depuração
    console.log("Verificando localStorage para desafiosProfessor");
    
    const desafiosProfessor = localStorage.getItem('desafiosProfessor');
    console.log("Valor bruto:", desafiosProfessor);
    
    if (desafiosProfessor) {
      try {
        const desafiosParsed = JSON.parse(desafiosProfessor);
        console.log("Desafios do professor encontrados:", desafiosParsed);
        
        // Mapear os desafios do professor para o mesmo formato dos desafios predefinidos
        const desafiosFormatados = desafiosParsed.map((d: any) => ({
          id: d.id,
          titulo: d.titulo,
          nivel: d.nivel,
          pontos: d.pontos,
          completado: false,
          categoria: d.categoria,
          tempo: `${d.tempo} min`,
          descricao: d.descricao,
          criadoPor: 'professor'
        }));
        
        console.log("Desafios formatados:", desafiosFormatados);
        
        // Combinar com os desafios predefinidos
        setTodosDesafios([...desafios, ...desafiosFormatados]);
      } catch (error) {
        console.error('Erro ao carregar desafios do professor:', error);
      }
    } else {
      console.log("Nenhum desafio de professor encontrado no localStorage");
    }
  }, []);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const desafiosFiltrados = todosDesafios.filter(desafio => {
    // Filtro principal
    let passou = true;
    if (filtro === 'completados') passou = !!desafio.completado;
    if (filtro === 'pendentes') passou = !desafio.completado && !desafio.bloqueado;
    if (filtro === 'bloqueados') passou = !!desafio.bloqueado;
    
    // Filtros adicionais
    if (passou && categoriaFiltro) {
      passou = desafio.categoria === categoriaFiltro;
    }
    
    if (passou && nivelFiltro) {
      passou = desafio.nivel === nivelFiltro;
    }
    
    return passou;
  });

  // Obter categorias únicas de todos os desafios
  const categorias = Array.from(new Set(todosDesafios.map(d => d.categoria)));
  
  // Obter níveis únicos de todos os desafios
  const niveis = Array.from(new Set(todosDesafios.map(d => d.nivel)));

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
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
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Desafios Matemáticos</h1>
        {user.tipo === 'professor' && (
          <Link href="/professor/desafios/criar" className="btn-primary flex items-center">
            <FaPlus className="mr-2" /> Criar Desafio
          </Link>
        )}
      </div>

      {/* Destaque para Operações Matemáticas */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="hidden sm:block">
                <FaCalculator size={40} className="mt-1" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Novo! Desafio de Operações Matemáticas</h2>
                <p className="mb-4">
                  Pratique adição, subtração, multiplicação e divisão em um desafio interativo e cronometrado.
                  Teste suas habilidades matemáticas e melhore sua velocidade de cálculo!
                </p>
                <Link href="/desafios/operacoes" className="inline-block bg-white text-[var(--primary)] font-bold px-6 py-2 rounded-lg hover:bg-opacity-90 transition">
                  Iniciar Desafio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user?.tipo === 'professor' && (
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <h3 className="font-bold">Ferramentas de Professor</h3>
          <p className="my-2">Se os desafios criados não estão abrindo, tente reiniciar o armazenamento local:</p>
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
            onClick={() => {
              localStorage.removeItem('desafiosProfessor');
              localStorage.removeItem('desafiosProfessor_backup');
              alert('Armazenamento de desafios reiniciado. Crie novos desafios.');
              window.location.reload();
            }}
          >
            Limpar desafios
          </button>
          <button 
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => {
              // Criar alguns desafios de teste
              const desafiosTeste = [
                {
                  id: "teste1",
                  titulo: "Desafio de Teste 1",
                  categoria: "Aritmética",
                  nivel: "Fácil",
                  pontos: 100,
                  tempo: 15,
                  descricao: "Este é um desafio de teste para verificar o funcionamento da plataforma.",
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
                  ],
                  professorId: user.id,
                  criadoEm: new Date().toISOString()
                }
              ];
              
              localStorage.setItem('desafiosProfessor', JSON.stringify(desafiosTeste));
              alert('Desafio de teste criado!');
              window.location.reload();
            }}
          >
            Criar desafio de teste
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar com filtros */}
        <div className="col-span-1">
          <div className="card mb-6">
            <h2 className="font-bold text-lg mb-4 flex items-center">
              <FaFilter className="mr-2" /> Filtros
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <div className="space-y-2">
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg ${filtro === 'todos' ? 'bg-[var(--primary)] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setFiltro('todos')}
                  >
                    Todos
                  </button>
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg ${filtro === 'completados' ? 'bg-[var(--primary)] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setFiltro('completados')}
                  >
                    <FaCheck className="inline-block mr-2" /> Completados
                  </button>
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg ${filtro === 'pendentes' ? 'bg-[var(--primary)] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setFiltro('pendentes')}
                  >
                    <FaRegClock className="inline-block mr-2" /> Pendentes
                  </button>
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg ${filtro === 'bloqueados' ? 'bg-[var(--primary)] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setFiltro('bloqueados')}
                  >
                    <FaLock className="inline-block mr-2" /> Bloqueados
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Categoria</h3>
                <div className="space-y-2">
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg ${categoriaFiltro === null ? 'bg-[var(--primary)] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setCategoriaFiltro(null)}
                  >
                    Todas
                  </button>
                  {categorias.map(categoria => (
                    <button 
                      key={categoria}
                      className={`w-full text-left px-3 py-2 rounded-lg ${categoriaFiltro === categoria ? 'bg-[var(--primary)] text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setCategoriaFiltro(categoria)}
                    >
                      {categoria}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Nível</h3>
                <div className="space-y-2">
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg ${nivelFiltro === null ? 'bg-[var(--primary)] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setNivelFiltro(null)}
                  >
                    Todos
                  </button>
                  {niveis.map(nivel => (
                    <button 
                      key={nivel}
                      className={`w-full text-left px-3 py-2 rounded-lg ${nivelFiltro === nivel ? 'bg-[var(--primary)] text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setNivelFiltro(nivel)}
                    >
                      {nivel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {user.tipo === 'professor' && (
            <div className="card">
              <h2 className="font-bold text-lg mb-4 flex items-center">
                <FaChalkboardTeacher className="mr-2" /> Área do Professor
              </h2>
              <p className="text-gray-600 mb-4">
                Como professor, você pode criar desafios personalizados para seus alunos.
              </p>
              <Link href="/professor/desafios/criar" className="btn-primary block text-center">
                Criar Novo Desafio
              </Link>
            </div>
          )}
        </div>
        
        {/* Lista de desafios */}
        <div className="col-span-1 md:col-span-3">
          <div className="card">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="font-bold text-lg">
                {filtro === 'todos' && !categoriaFiltro && !nivelFiltro && 'Todos os Desafios'}
                {filtro === 'completados' && 'Desafios Completados'}
                {filtro === 'pendentes' && 'Desafios Pendentes'}
                {filtro === 'bloqueados' && 'Desafios Bloqueados'}
                {(categoriaFiltro || nivelFiltro) && (
                  <>
                    {categoriaFiltro && <span>Categoria: {categoriaFiltro}</span>}
                    {categoriaFiltro && nivelFiltro && ' | '}
                    {nivelFiltro && <span>Nível: {nivelFiltro}</span>}
                  </>
                )}
              </h2>
              <span className="text-sm text-gray-500">{desafiosFiltrados.length} desafios</span>
            </div>
            
            <div className="space-y-4">
              {desafiosFiltrados.length > 0 ? (
                desafiosFiltrados.map((desafio) => (
                  <DesafioCard key={desafio.id} desafio={desafio} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum desafio encontrado para os filtros selecionados.</p>
                  <button 
                    onClick={() => {
                      setFiltro('todos');
                      setCategoriaFiltro(null);
                      setNivelFiltro(null);
                    }}
                    className="mt-2 text-[var(--primary)] hover:underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Cartão de Desafio
function DesafioCard({ desafio }: { desafio: Desafio }) {
  const { user } = useAuth();
  
  // Função para verificar desafios no localStorage
  const verificarDesafioExistente = (id: string | number) => {
    try {
      const desafiosProfessor = localStorage.getItem('desafiosProfessor');
      if (desafiosProfessor) {
        const desafios = JSON.parse(desafiosProfessor);
        return desafios.some((d: any) => d.id.toString() === id.toString());
      }
    } catch (error) {
      console.error("Erro ao verificar desafio:", error);
    }
    return false;
  };
  
  // Handler para clique no cartão
  const handleCardClick = (e: React.MouseEvent) => {
    if (desafio.bloqueado) {
      e.preventDefault();
      alert('Este desafio ainda está bloqueado! Complete os desafios anteriores para desbloqueá-lo.');
      return;
    }
    
    // Se for desafio de professor, verificar se existe no localStorage
    if (desafio.criadoPor === 'professor') {
      const existeNoLocalStorage = verificarDesafioExistente(desafio.id);
      
      if (!existeNoLocalStorage) {
        console.log("Desafio não encontrado no localStorage, criando cópia temporária");
        e.preventDefault();
        
        // Criar uma cópia temporária do desafio
        const desafioTemp = {
          id: desafio.id.toString(),
          titulo: desafio.titulo,
          categoria: desafio.categoria,
          nivel: desafio.nivel,
          pontos: desafio.pontos,
          tempo: parseInt(desafio.tempo.replace(" min", "")) * 60,
          descricao: desafio.descricao,
          questoes: [
            {
              id: 1,
              enunciado: "Este é um desafio recuperado. Responda a esta questão para ganhar pontos.",
              alternativas: [
                { id: "a", texto: "Resposta A" },
                { id: "b", texto: "Resposta B" },
                { id: "c", texto: "Resposta C" },
                { id: "d", texto: "Resposta D" }
              ],
              respostaCorreta: "a"
            }
          ],
          professorId: user?.id,
          criadoEm: new Date().toISOString()
        };
        
        // Armazenar no localStorage
        try {
          const desafiosAtuais = localStorage.getItem('desafiosProfessor');
          let arrayDesafios = [];
          
          if (desafiosAtuais) {
            arrayDesafios = JSON.parse(desafiosAtuais);
          }
          
          arrayDesafios.push(desafioTemp);
          localStorage.setItem('desafiosProfessor', JSON.stringify(arrayDesafios));
          localStorage.setItem('desafiosProfessor_backup', JSON.stringify(arrayDesafios));
          
          // Redirecionar manualmente
          window.location.href = `/desafios/${desafio.id}`;
        } catch (error) {
          console.error("Erro ao salvar desafio temporário:", error);
          alert("Houve um erro ao abrir o desafio. Por favor, tente novamente.");
        }
      }
    }
  };
  
  return (
    <Link 
      href={desafio.bloqueado ? '#' : `/desafios/${desafio.id}`}
      onClick={handleCardClick}
      className={`card group hover:shadow-lg transition-all duration-300 ${
        desafio.bloqueado 
          ? 'opacity-70 cursor-not-allowed' 
          : 'hover:scale-[1.02] cursor-pointer'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            desafio.nivel === 'Fácil' 
              ? 'bg-green-100 text-green-600' 
              : desafio.nivel === 'Médio'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-red-100 text-red-600'
          }`}>
            <FaCalculator className="text-lg" />
          </div>
          <div className="ml-3">
            <h3 className="font-bold truncate max-w-[180px] text-[var(--text)]">{desafio.titulo}</h3>
            <p className="text-xs text-gray-500">{desafio.categoria}</p>
          </div>
        </div>
        
        {desafio.bloqueado && (
          <span className="text-gray-500 rounded-full p-1">
            <FaLock />
          </span>
        )}
        
        {desafio.completado && !desafio.bloqueado && (
          <div className="p-1 bg-green-100 text-green-600 rounded-full">
            <FaCheck />
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{desafio.descricao}</p>
      
      <div className="mt-auto">
        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <FaRegClock className="mr-1" />
            <span>{desafio.tempo}</span>
          </div>
          
          <div className="flex items-center text-xs">
            <div className="flex items-center mr-2">
              <FaChalkboardTeacher className={`mr-1 ${
                desafio.criadoPor === 'professor' ? 'text-purple-500' : 'text-gray-400'
              }`} />
              {desafio.criadoPor === 'professor' && (
                <span className="text-purple-500">Professor</span>
              )}
            </div>
            
            <div className="flex items-center">
              <FaTrophy className="mr-1 text-[var(--primary)]" />
              <span className="font-semibold text-[var(--primary)]">{desafio.pontos}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 