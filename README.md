# IA OCR

Este é um projeto que utiliza OCR (Reconhecimento Óptico de Caracteres) para processar documentos enviados pelos usuários e gerar explicações contextuais utilizando IA. O projeto é dividido em duas partes: o backend (NestJS) e o frontend (Next.js).

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- Node.js (versão 16 ou superior)
- npm ou yarn
- PostgreSQL (para o banco de dados)
- Ollama (Inteligência Artificial usada)

## Configuração do Ambiente

1. Clone este repositório:

   ```bash
   git clone https://github.com/bdpietroo/ia-ocr.git
   cd ia-ocr

2. Configure o banco de dados PostgreSQL:

- Crie um banco de dados no PostgreSQL.

- Atualize o arquivo backend/.env com a URL de conexão do banco de dados:

DATABASE_URL=postgresql://usuario:@localhost:5432/nome_do_banco
JWT_SECRET=sua_chave_secreta

3. Instale as dependências do backend:
   
   ```bash
   cd backend
   npm install

4. Instale as dependências do frontend:
   
   ```bash
   cd ../frontend
   npm install

5. Execute as migrações do banco de dados: 

   ```bash
   cd ../backend
   npx prisma migrate dev

6. Configure os arquivos .traineddata para o OCR:

- Certifique-se de que os arquivos eng.traineddata e por.traineddata estão na pasta backend/.

## Executando o Projeto

Backend 

1. Inicie o servidor do backend:
   
   ```bash
   cd backend
   npm run start:dev

- O backend estará disponível em http://localhost:4000.

Frontend

1. Inicie o servidor do frontend:
   
   ```bash
   cd frontend
   npm run dev

- O frontend estará disponível em http://localhost:3000.

## Testando o Projeto

   1. Acesse o frontend em http://localhost:3000/register.
   2. Registre-se como um novo usuário.
   3. Faça login e envie um arquivo na página de upload.
   4. Visualize os documentos enviados na página de histórico.
