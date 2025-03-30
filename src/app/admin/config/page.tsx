'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaWhatsapp, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Tipo para as configurações de contato
interface ContatoConfig {
  whatsapp: string;
  instagram: string;
  email: string;
}

export default function ConfiguracaoContato() {
  const [contato, setContato] = useState<ContatoConfig>({
    whatsapp: 'https://wa.me/5511987654321',
    instagram: 'https://instagram.com/matematica.divertida',
    email: 'contato@matematicadivertida.com'
  });
  
  const [telefone, setTelefone] = useState('5511987654321');
  const [instagramHandle, setInstagramHandle] = useState('matematica.divertida');
  const [emailContato, setEmailContato] = useState('contato@matematicadivertida.com');
  
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Verificar se o usuário é admin
  useEffect(() => {
    if (!isLoading && (!user || user.tipo !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);
  
  // Carregar configurações existentes ao iniciar
  useEffect(() => {
    const configSalva = localStorage.getItem('matematica_divertida_config_contato');
    
    if (configSalva) {
      try {
        const configParsed = JSON.parse(configSalva);
        setContato(configParsed);
        
        // Extrair telefone do link do WhatsApp
        const telefoneMatch = configParsed.whatsapp.match(/(\d+)$/);
        if (telefoneMatch) setTelefone(telefoneMatch[1]);
        
        // Extrair username do Instagram
        const instaMatch = configParsed.instagram.match(/([^\/]+)$/);
        if (instaMatch) setInstagramHandle(instaMatch[1]);
        
        // Extrair email
        setEmailContato(configParsed.email);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);
  
  // Salvar configurações
  const salvarConfiguracoes = () => {
    setSalvando(true);
    
    try {
      // Formatar links corretamente
      const config: ContatoConfig = {
        whatsapp: `https://wa.me/${telefone.replace(/\D/g, '')}`,
        instagram: `https://instagram.com/${instagramHandle.replace('@', '')}`,
        email: emailContato
      };
      
      localStorage.setItem('matematica_divertida_config_contato', JSON.stringify(config));
      setContato(config);
      
      setMensagem({
        tipo: 'sucesso',
        texto: 'Configurações salvas com sucesso!'
      });
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao salvar configurações.'
      });
    } finally {
      setSalvando(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-t-4 border-t-blue-500 rounded-full"></div>
      </div>
    );
  }
  
  if (!user || user.tipo !== 'admin') {
    return null; // Será redirecionado pelo useEffect
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="flex items-center text-[var(--primary)] hover:underline">
          <FaArrowLeft className="mr-2" /> Voltar para Dashboard
        </Link>
      </div>
      
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">Configurações de Contato</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h3 className="text-lg font-medium text-blue-700 mb-1">Nota Importante</h3>
          <p className="text-sm text-blue-600">
            As configurações feitas nesta página afetam apenas o navegador atual em que você está acessando.
            Para alterar os links de contato em todos os dispositivos, será necessário editar diretamente o código
            no arquivo <code className="bg-blue-100 px-1 py-0.5 rounded">src/components/Footer.tsx</code>. 
            Entre em contato com o desenvolvedor para fazer essas alterações permanentes.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número do WhatsApp (com DDD)
            </label>
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-l-lg border border-r-0 border-gray-300">
                <FaWhatsapp className="text-green-500" />
              </div>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: 11987654321"
                className="flex-1 p-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Link gerado: {`https://wa.me/${telefone.replace(/\D/g, '')}`}
            </p>
          </div>
          
          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome de usuário do Instagram (sem @)
            </label>
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-l-lg border border-r-0 border-gray-300">
                <FaInstagram className="text-purple-500" />
              </div>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value.replace('@', ''))}
                placeholder="Ex: matematica.divertida"
                className="flex-1 p-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Link gerado: {`https://instagram.com/${instagramHandle.replace('@', '')}`}
            </p>
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email de contato
            </label>
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-l-lg border border-r-0 border-gray-300">
                <FaEnvelope className="text-blue-500" />
              </div>
              <input
                type="email"
                value={emailContato}
                onChange={(e) => setEmailContato(e.target.value)}
                placeholder="Ex: contato@matematicadivertida.com"
                className="flex-1 p-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>
          
          {/* Botão Salvar */}
          <div className="pt-4">
            <button
              onClick={salvarConfiguracoes}
              disabled={salvando}
              className="btn-primary flex items-center justify-center w-full py-2"
            >
              {salvando ? (
                <div className="animate-spin h-5 w-5 border-2 border-t-2 border-t-white rounded-full mr-2"></div>
              ) : (
                <FaSave className="mr-2" />
              )}
              {salvando ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
          
          {/* Mensagem de feedback */}
          {mensagem && (
            <div 
              className={`mt-4 p-3 rounded-lg ${
                mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {mensagem.texto}
            </div>
          )}
        </div>
      </div>
      
      <div className="card p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <div className="bg-[var(--text)] text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <div className="flex space-x-4 mb-4">
            <a 
              href={contato.whatsapp}
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-[var(--accent)] transition-colors"
            >
              <FaWhatsapp className="h-6 w-6" />
            </a>
            <a 
              href={contato.instagram}
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-[var(--accent)] transition-colors"
            >
              <FaInstagram className="h-6 w-6" />
            </a>
            <a 
              href={`mailto:${contato.email}`}
              className="text-white hover:text-[var(--accent)] transition-colors"
            >
              <FaEnvelope className="h-6 w-6" />
            </a>
          </div>
          <p className="text-sm opacity-80">
            Estamos sempre disponíveis para ajudar!
          </p>
          <p className="text-sm mt-2">
            <a 
              href={`mailto:${contato.email}`}
              className="text-[var(--accent)] hover:underline"
            >
              {contato.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 