'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaSchool, 
  FaTrophy, 
  FaCalendarAlt,
  FaChartLine,
  FaStar,
  FaCheck,
  FaClock,
  FaLock
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Dados fictícios de desafios para o relatório do aluno
const desafiosDoAluno = [
  {
    id: 1,
    titulo: "Números Primos",
    dataCompleto: "2023-05-15",
    pontos: 100,
    tempo: "10:25",
    acertos: 8,
    total: 10
  },
  {
    id: 2,
    titulo: "Frações e Decimais",
    dataCompleto: "2023-05-18",
    pontos: 150,
    tempo: "15:30",
    acertos: 7,
    total: 10
  },
  {
    id: 3,
    titulo: "Geometria Básica",
    dataCompleto: null,
    pontos: 0,
    tempo: "--:--",
    acertos: 0,
    total: 10,
    emAndamento: true
  },
  {
    id: 4,
    titulo: "Equações de 1º Grau",
    dataCompleto: null,
    pontos: 0,
    tempo: "--:--",
    acertos: 0,
    total: 10,
    bloqueado: true
  },
];

// Dados fictícios de medalhas
const medalhasDoAluno = [
  { id: 1, nome: "Primeiro Desafio", descricao: "Completou seu primeiro desafio", data: "2023-05-15" },
  { id: 2, nome: "Mestre de Frações", descricao: "Acertou 100% no desafio de frações", data: "2023-05-18" },
];

export default function DetalhesAluno({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [aluno, setAluno] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  // Redirecionar se não for professor
  useEffect(() => {
    if (!isLoading && user?.tipo !== 'professor') {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  // Buscar dados do aluno
  useEffect(() => {
    const buscarAluno = async () => {
      setCarregando(true);
      try {
        // Simulando busca do aluno
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Buscar informações do localStorage
        const alunosConvidados = localStorage.getItem('matematica_divertida_alunos_convidados');
        const alunosConvidadosParsed = alunosConvidados ? JSON.parse(alunosConvidados) : [];
        
        // Buscar usuários registrados
        const usuariosRegistrados = localStorage.getItem('matematica_divertida_users');
        const usuariosRegistradosParsed = usuariosRegistrados ? JSON.parse(usuariosRegistrados) : [];
        
        // Procurar aluno em ambas as listas
        let alunoEncontrado = alunosConvidadosParsed.find((a: any) => 
          a.id === params.id && a.professorId === user?.id
        );
        
        if (!alunoEncontrado) {
          alunoEncontrado = usuariosRegistradosParsed.find((a: any) => 
            a.id === params.id && a.tipo === 'aluno' && 
            (a.professorId === user?.id || a.escola === user?.escola)
          );
        }
        
        if (alunoEncontrado) {
          // Adicionar dados fictícios de desempenho
          setAluno({
            ...alunoEncontrado,
            pontuacao: alunoEncontrado.pontuacao || Math.floor(Math.random() * 500) + 200,
            desafiosCompletados: alunoEncontrado.desafiosCompletados || 2,
            ultimoAcesso: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            medalhas: medalhasDoAluno,
            desafios: desafiosDoAluno,
            posicaoRanking: Math.floor(Math.random() * 30) + 1
          });
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao buscar aluno:', error);
      } finally {
        setCarregando(false);
      }
    };
    
    if (!isLoading && user) {
      buscarAluno();
    }
  }, [params.id, user, isLoading, router]);

  if (isLoading || carregando) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do aluno...</p>
        </div>
      </div>
    );
  }

  if (!user || !aluno) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="flex items-center text-[var(--primary)] hover:underline">
          <FaArrowLeft className="mr-2" /> Voltar para Dashboard
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informações do Aluno */}
        <div className="md:col-span-1">
          <div className="card mb-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-[var(--primary)] text-white flex items-center justify-center mb-4">
                <FaUser size={40} />
              </div>
              <h2 className="text-xl font-bold text-center">{aluno.nome}</h2>
              <p className="text-gray-500 flex items-center">
                <FaSchool className="mr-1" /> {aluno.escola}
              </p>
              <p className="text-gray-500 flex items-center mt-1">
                <FaEnvelope className="mr-1" /> {aluno.email}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pontuação Total</span>
                <span className="font-bold text-[var(--primary)]">{aluno.pontuacao}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Desafios Completados</span>
                <span className="font-bold text-[var(--primary)]">{aluno.desafiosCompletados}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Posição no Ranking</span>
                <span className="font-bold text-[var(--primary)]">{aluno.posicaoRanking}º</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Último Acesso</span>
                <span className="font-bold text-[var(--primary)]">{aluno.ultimoAcesso}</span>
              </div>
            </div>
          </div>
          
          {/* Medalhas e Conquistas */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Medalhas e Conquistas</h3>
            
            {aluno.medalhas.length > 0 ? (
              <div className="space-y-4">
                {aluno.medalhas.map((medalha: any) => (
                  <div key={medalha.id} className="flex items-start p-3 rounded-lg bg-gray-50">
                    <div className="mr-3 mt-1 text-yellow-500">
                      <FaStar size={20} />
                    </div>
                    <div>
                      <div className="font-medium">{medalha.nome}</div>
                      <div className="text-sm text-gray-600">{medalha.descricao}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <FaCalendarAlt className="inline-block mr-1" /> {medalha.data}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                Este aluno ainda não conquistou medalhas.
              </p>
            )}
          </div>
        </div>
        
        {/* Progresso e Desafios */}
        <div className="md:col-span-2">
          <div className="card mb-6">
            <h3 className="font-bold text-lg mb-4">Progresso do Aluno</h3>
            
            <div className="bg-gray-100 rounded-full h-4 mb-6">
              <div 
                className="bg-[var(--primary)] h-4 rounded-full" 
                style={{ width: `${(aluno.desafiosCompletados / desafiosDoAluno.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
              <div className="bg-[var(--primary)] bg-opacity-10 p-4 rounded-lg text-center">
                <div className="text-[var(--primary)] mb-1">
                  <FaCheck size={20} className="mx-auto" />
                </div>
                <div className="text-sm font-medium">Completados</div>
                <div className="text-2xl font-bold mt-1">{aluno.desafiosCompletados}</div>
              </div>
              
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <div className="text-yellow-600 mb-1">
                  <FaClock size={20} className="mx-auto" />
                </div>
                <div className="text-sm font-medium">Em Andamento</div>
                <div className="text-2xl font-bold mt-1">
                  {desafiosDoAluno.filter(d => d.emAndamento).length}
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-gray-600 mb-1">
                  <FaLock size={20} className="mx-auto" />
                </div>
                <div className="text-sm font-medium">Bloqueados</div>
                <div className="text-2xl font-bold mt-1">
                  {desafiosDoAluno.filter(d => d.bloqueado).length}
                </div>
              </div>
              
              <div className="bg-[var(--accent)] bg-opacity-10 p-4 rounded-lg text-center">
                <div className="text-[var(--accent)] mb-1">
                  <FaTrophy size={20} className="mx-auto" />
                </div>
                <div className="text-sm font-medium">Medalhas</div>
                <div className="text-2xl font-bold mt-1">{aluno.medalhas.length}</div>
              </div>
            </div>
          </div>
          
          {/* Tabela de Desafios */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Desafios e Atividades</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Desafio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pontos
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Desempenho
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {desafiosDoAluno.map((desafio) => (
                    <tr key={desafio.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{desafio.titulo}</div>
                        </div>
                        {desafio.dataCompleto && (
                          <div className="text-xs text-gray-500">
                            <FaCalendarAlt className="inline-block mr-1" /> {desafio.dataCompleto}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {desafio.pontos > 0 ? `${desafio.pontos} pontos` : '--'}
                        </div>
                        {desafio.dataCompleto && (
                          <div className="text-xs text-gray-500">
                            <FaClock className="inline-block mr-1" /> {desafio.tempo}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {desafio.dataCompleto ? (
                          <>
                            <div className="text-sm font-medium text-gray-900">
                              {desafio.acertos}/{desafio.total} acertos
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className={`h-2 rounded-full ${desafio.acertos / desafio.total >= 0.7 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                                style={{ width: `${(desafio.acertos / desafio.total) * 100}%` }}
                              ></div>
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full 
                          ${desafio.dataCompleto 
                            ? 'bg-green-100 text-green-800' 
                            : desafio.emAndamento 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-800'}`}
                        >
                          {desafio.dataCompleto 
                            ? 'Completado' 
                            : desafio.emAndamento 
                              ? 'Em Andamento' 
                              : 'Não Iniciado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 