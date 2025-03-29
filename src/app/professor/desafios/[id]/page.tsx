'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaSave, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
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
  professorId: string;
  criadoEm: string;
};

export default function EditarDesafio() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nivel, setNivel] = useState('Fácil');
  const [pontos, setPontos] = useState('100');
  const [tempo, setTempo] = useState('15');
  const [descricao, setDescricao] = useState('');
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  
  // Carregar dados do desafio
  useEffect(() => {
    if (!isLoading && user?.tipo !== 'professor') {
      router.push('/dashboard');
      return;
    }
    
    const id = params?.id;
    if (!id) return;
    
    // Buscar desafio no localStorage
    const desafiosExistentes = localStorage.getItem('desafiosProfessor');
    if (desafiosExistentes) {
      const desafios = JSON.parse(desafiosExistentes);
      const desafioEncontrado = desafios.find((d: Desafio) => d.id.toString() === id.toString());
      
      if (desafioEncontrado) {
        setDesafio(desafioEncontrado);
        setTitulo(desafioEncontrado.titulo);
        setCategoria(desafioEncontrado.categoria);
        setNivel(desafioEncontrado.nivel);
        setPontos(desafioEncontrado.pontos.toString());
        setTempo(desafioEncontrado.tempo.toString());
        setDescricao(desafioEncontrado.descricao);
        setQuestoes(desafioEncontrado.questoes);
      } else {
        setErro('Desafio não encontrado');
      }
    }
    
    setCarregando(false);
  }, [params, router, user, isLoading]);
  
  // Redirecionar se não for professor
  if (!isLoading && user?.tipo !== 'professor') {
    router.push('/dashboard');
    return null;
  }
  
  const handleAddQuestao = () => {
    const novaQuestao: Questao = {
      id: questoes.length > 0 ? Math.max(...questoes.map(q => q.id)) + 1 : 1,
      enunciado: '',
      alternativas: [
        { id: 'a', texto: '' },
        { id: 'b', texto: '' },
        { id: 'c', texto: '' },
        { id: 'd', texto: '' }
      ],
      respostaCorreta: 'a'
    };
    
    setQuestoes([...questoes, novaQuestao]);
  };
  
  const handleRemoverQuestao = (id: number) => {
    if (questoes.length <= 1) {
      setErro('O desafio precisa ter pelo menos uma questão');
      return;
    }
    
    setQuestoes(questoes.filter(q => q.id !== id));
  };
  
  const handleChangeQuestao = (id: number, campo: string, valor: string) => {
    setQuestoes(questoes.map(q => {
      if (q.id === id) {
        return { ...q, [campo]: valor };
      }
      return q;
    }));
  };
  
  const handleChangeAlternativa = (questaoId: number, alternativaId: string, valor: string) => {
    setQuestoes(questoes.map(q => {
      if (q.id === questaoId) {
        return {
          ...q,
          alternativas: q.alternativas.map(alt => {
            if (alt.id === alternativaId) {
              return { ...alt, texto: valor };
            }
            return alt;
          })
        };
      }
      return q;
    }));
  };
  
  const handleChangeRespostaCorreta = (questaoId: number, valor: string) => {
    setQuestoes(questoes.map(q => {
      if (q.id === questaoId) {
        return { ...q, respostaCorreta: valor };
      }
      return q;
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    
    // Validações
    if (!titulo.trim()) {
      setErro('O título é obrigatório');
      return;
    }
    
    if (!categoria.trim()) {
      setErro('A categoria é obrigatória');
      return;
    }
    
    if (!descricao.trim()) {
      setErro('A descrição é obrigatória');
      return;
    }
    
    // Validar questões
    for (const questao of questoes) {
      if (!questao.enunciado.trim()) {
        setErro(`O enunciado da questão ${questao.id} é obrigatório`);
        return;
      }
      
      for (const alt of questao.alternativas) {
        if (!alt.texto.trim()) {
          setErro(`A alternativa ${alt.id.toUpperCase()} da questão ${questao.id} é obrigatória`);
          return;
        }
      }
    }
    
    setSalvando(true);
    
    // Simular salvar no banco de dados
    setTimeout(() => {
      // Em um caso real, você salvaria no banco de dados aqui
      if (!desafio) {
        setSalvando(false);
        return;
      }
      
      const desafiosExistentes = localStorage.getItem('desafiosProfessor');
      const desafios = desafiosExistentes ? JSON.parse(desafiosExistentes) : [];
      
      const desafioAtualizado = {
        ...desafio,
        titulo,
        categoria,
        nivel,
        pontos: parseInt(pontos),
        tempo: parseInt(tempo),
        descricao,
        questoes,
        atualizadoEm: new Date().toISOString()
      };
      
      const index = desafios.findIndex((d: Desafio) => d.id.toString() === desafio.id.toString());
      if (index !== -1) {
        desafios[index] = desafioAtualizado;
        localStorage.setItem('desafiosProfessor', JSON.stringify(desafios));
      }
      
      setSalvando(false);
      router.push('/desafios');
    }, 1500);
  };
  
  if (isLoading || carregando) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (erro === 'Desafio não encontrado') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>Desafio não encontrado</p>
        </div>
        <Link href="/desafios" className="btn-primary">
          Voltar para Desafios
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/desafios" className="btn-icon mr-4">
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold">Editar Desafio</h1>
        </div>
        <button 
          className="btn-primary flex items-center" 
          onClick={handleSubmit} 
          disabled={salvando}
        >
          {salvando ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
              Salvando...
            </>
          ) : (
            <>
              <FaSave className="mr-2" /> Salvar Alterações
            </>
          )}
        </button>
      </div>
      
      {erro && erro !== 'Desafio não encontrado' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{erro}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Informações do Desafio</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Título do Desafio</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-lg" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Geometria Básica"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Categoria</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-lg" 
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Ex: Geometria"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Nível</label>
            <select 
              className="w-full px-4 py-2 border rounded-lg"
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
            >
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Pontos</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 border rounded-lg" 
              value={pontos}
              onChange={(e) => setPontos(e.target.value)}
              min="50"
              max="500"
              step="10"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Tempo (minutos)</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 border rounded-lg" 
              value={tempo}
              onChange={(e) => setTempo(e.target.value)}
              min="5"
              max="60"
              step="5"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Descrição</label>
          <textarea 
            className="w-full px-4 py-2 border rounded-lg" 
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            placeholder="Descreva o objetivo do desafio e o que os alunos irão aprender"
          ></textarea>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Questões</h2>
          <button 
            className="btn-secondary flex items-center"
            onClick={handleAddQuestao}
          >
            <FaPlus className="mr-2" /> Adicionar Questão
          </button>
        </div>
        
        {questoes.map((questao, index) => (
          <div key={questao.id} className="mb-8 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Questão {index + 1}</h3>
              <button 
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoverQuestao(questao.id)}
              >
                <FaTrash />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Enunciado</label>
              <textarea 
                className="w-full px-4 py-2 border rounded-lg" 
                value={questao.enunciado}
                onChange={(e) => handleChangeQuestao(questao.id, 'enunciado', e.target.value)}
                rows={2}
                placeholder="Digite o enunciado da questão"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Alternativas</label>
              {questao.alternativas.map((alt) => (
                <div key={alt.id} className="flex items-center mb-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-2">
                    {alt.id.toUpperCase()}
                  </span>
                  <input 
                    type="text" 
                    className="flex-1 px-4 py-2 border rounded-lg" 
                    value={alt.texto}
                    onChange={(e) => handleChangeAlternativa(questao.id, alt.id, e.target.value)}
                    placeholder={`Alternativa ${alt.id.toUpperCase()}`}
                  />
                </div>
              ))}
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Resposta Correta</label>
              <div className="grid grid-cols-4 gap-2">
                {questao.alternativas.map((alt) => (
                  <label 
                    key={alt.id} 
                    className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer ${
                      questao.respostaCorreta === alt.id ? 'bg-[var(--primary)] text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`resposta-${questao.id}`}
                      value={alt.id}
                      checked={questao.respostaCorreta === alt.id}
                      onChange={() => handleChangeRespostaCorreta(questao.id, alt.id)}
                      className="hidden"
                    />
                    Alternativa {alt.id.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Link href="/desafios" className="btn-secondary">
          Cancelar
        </Link>
        <button 
          className="btn-primary flex items-center" 
          onClick={handleSubmit} 
          disabled={salvando}
        >
          {salvando ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
              Salvando...
            </>
          ) : (
            <>
              <FaSave className="mr-2" /> Salvar Alterações
            </>
          )}
        </button>
      </div>
    </div>
  );
} 