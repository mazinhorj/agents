# NLW Agents

Projeto para gerenciamento de perguntas e respostas em tempo real, com integração de IA, ideal para lives e streamings.

## Tecnologias Utilizadas

- **Frontend:** React 19, Vite, TypeScript, TailwindCSS, TanStack React Query, Lucide Icons, shadcn/ui
- **Backend:** Fastify, Zod, Drizzle ORM, Postgres (com extensão pgvector)
- **Dev Tools:** Biome, Docker, Drizzle Kit

## Padrões de Projeto

- **Monorepo:** Separação entre `server` (backend) e `web` (frontend)
- **Type-safe:** Uso extensivo de TypeScript e validação com Zod
- **Componentização:** UI baseada em componentes reutilizáveis (shadcn/ui)
- **API REST:** Comunicação entre frontend e backend via endpoints RESTful
- **Gerenciamento de estado:** React Query para cache e sincronização de dados

## Setup do Projeto

### Pré-requisitos

- Node.js >= 18
- Docker
- Yarn ou npm

### Instruções

1. **Clone o repositório**
   ```sh
   git clone <repo-url>
   cd agents
###

2. **Suba o banco de dados Postgres com pgvector**
    ```sh
    cd server
    docker compose up -d
###

3. **Configure as variáveis de ambiente**
    > Copie .env.exemple para .env e ajuste se necessário.
###

4. **Instale as dependências**
    ```sh
    cd ../web && npm install
    cd ../server && npm install
###

5. **Rode as migrations e popule o banco**
    ```sh
    # No diretório server
    npx drizzle-kit migrate
    npm run db:seed
###

6. **Inicie o backend**
    ```sh
    npm run dev
###

7. **Inicie o frontend**
    ```sh
    cd ../web
    npm run dev
###

8. **Acesse a aplicação**

    > Frontend: http://localhost:5173

    > Backend: http://localhost:3333

###

Autor: Rocketseat 🚀 && MazinhoBigDaddy
