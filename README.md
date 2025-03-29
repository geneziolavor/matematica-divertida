# Matemática Divertida

Uma plataforma interativa para o ensino de matemática, desenvolvida para uma competição escolar.

## Funcionalidades Principais

- Sistema de usuários (professores e alunos)
- Desafios matemáticos interativos
- Ranking de pontuações
- Professores podem criar desafios e gerenciar alunos
- Feedback sonoro e visual durante os desafios

## Requisitos

- Node.js 18+ 
- npm ou yarn
- MongoDB Atlas (para produção)

## Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/matematica-divertida.git
   cd matematica-divertida
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.local.example` para `.env.local`
   - Preencha as variáveis com seus dados de MongoDB Atlas

4. Para desenvolvimento local:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Acesse a aplicação em `http://localhost:3000`

## Implantação Online

Para implantar a aplicação no Vercel:

1. Crie uma conta no [Vercel](https://vercel.com)
2. Instale a CLI do Vercel:
   ```bash
   npm install -g vercel
   ```
3. Faça login e implante:
   ```bash
   vercel login
   vercel
   ```
4. Adicione suas variáveis de ambiente no dashboard do Vercel

## Estrutura do Projeto

```
matematica-divertida/
├── public/           # Arquivos estáticos
├── src/
│   ├── app/          # Páginas da aplicação (Next.js App Router)
│   ├── components/   # Componentes reutilizáveis
│   ├── context/      # Contextos React (ex: AuthContext)
│   ├── lib/          # Funções utilitárias e conexão com banco de dados
│   └── models/       # Modelos do MongoDB
├── .env.local        # Variáveis de ambiente
└── package.json
```

## Banco de Dados

O projeto utiliza MongoDB como banco de dados, com os seguintes modelos:

- Users: armazena informações de professores e alunos
- Desafios: armazena os desafios criados
- Pontuacoes: armazena as pontuações dos alunos

## Licença

Este projeto é para fins educacionais.
