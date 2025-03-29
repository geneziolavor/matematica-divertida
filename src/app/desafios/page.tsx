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

// Dados fictícios de desafios
const desafios = [
  {
    id: 1,
    titulo: "Números Primos",
    nivel: "Fácil",
    pontos: 100,
    completado: true,
    categoria: "Aritmética",
    tempo: "15 min",
    descricao: "Descubra e identifique números primos em sequências divertidas."
  },
  {
    id: 2,
    titulo: "Frações e Decimais",
    nivel: "Médio",
    pontos: 150,
    completado: true,
    categoria: "Operações",
    tempo: "20 min",
    descricao: "Converta frações em decimais e resolva problemas práticos."
  },
  {
    id: 3,
    titulo: "Geometria Básica",
    nivel: "Fácil",
    pontos: 100,
    completado: false,
    categoria: "Geometria",
    tempo: "15 min",
    descricao: "Identifique formas geométricas e calcule áreas de figuras planas."
  },
  {
    id: 4,
    titulo: "Equações de 1º Grau",
    nivel: "Médio",
    pontos: 200,
    completado: false,
    categoria: "Álgebra",
    tempo: "25 min",
    descricao: "Resolva equações de primeiro grau e aplique em problemas práticos."
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
    descricao: "Resolva problemas de lógica matemática que exigem raciocínio avançado."
  },
  {
    id: 6,
    titulo: "Estatística Básica",
    nivel: "Médio",
    pontos: 180,
    completado: false,
    categoria: "Estatística",
    tempo: "20 min",
    descricao: "Aprenda conceitos básicos de média, mediana e moda em conjuntos de dados."
  },
  {
    id: 7,
    titulo: "Probabilidade",
    nivel: "Difícil",
    pontos: 250,
    completado: false,
    categoria: "Probabilidade",
    tempo: "25 min",
    descricao: "Calcule a probabilidade de eventos em situações cotidianas."
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
    descricao: "Explore funções quadráticas e suas aplicações em problemas reais."
  }
];

export default function Desafios() {
  const [filtro, setFiltro] = useState('todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null);
  const [nivelFiltro, setNivelFiltro] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const desafiosFiltrados = desafios.filter(desafio => {
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

  // Obter categorias únicas
  const categorias = Array.from(new Set(desafios.map(d => d.categoria)));
  
  // Obter níveis únicos
  const niveis = Array.from(new Set(desafios.map(d => d.nivel)));

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
                  <div key={desafio.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-bold text-lg">{desafio.titulo}</h3>
                          {desafio.completado && (
                            <span className="ml-2 bg-[var(--success)] text-white px-2 py-1 rounded-full text-xs flex items-center">
                              <FaCheck className="mr-1" /> Completado
                            </span>
                          )}
                          {desafio.bloqueado && (
                            <span className="ml-2 bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center">
                              <FaLock className="mr-1" /> Bloqueado
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mt-1">{desafio.descricao}</p>
                        
                        <div className="flex flex-wrap mt-3 gap-2">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                            <FaStar className="mr-1 text-[var(--accent)]" /> {desafio.nivel}
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                            <FaTrophy className="mr-1 text-[var(--primary)]" /> {desafio.pontos} pts
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                            <FaRegClock className="mr-1 text-[var(--secondary)]" /> {desafio.tempo}
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {desafio.categoria}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        {user.tipo === 'professor' ? (
                          <Link 
                            href={`/professor/desafios/${desafio.id}`}
                            className="btn-secondary"
                          >
                            Editar
                          </Link>
                        ) : !desafio.bloqueado && (
                          <Link 
                            href={`/desafios/${desafio.id}`}
                            className={`btn-${desafio.completado ? 'secondary' : 'primary'}`}
                          >
                            {desafio.completado ? 'Refazer' : 'Iniciar'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
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