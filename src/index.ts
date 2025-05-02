import express from 'express';
import cors from 'cors';
import { createConnection, getRepository } from 'typeorm';
import dotenv from 'dotenv';
import routes from './routes';
import path from 'path';
import { User } from './entities/User';

// Carrega as variáveis de ambiente
dotenv.config();

async function initializeDatabase() {
  console.log('Iniciando conexão com o banco de dados...');
  
  const connection = await createConnection({
    type: 'sqlite',
    database: path.resolve(__dirname, '..', 'mealplanner.db'),
    entities: [path.join(__dirname, 'entities', '**', '*.{ts,js}')],
    synchronize: true,
    logging: true,
  });

  console.log('Conexão com o banco de dados estabelecida com sucesso!');
  console.log('Entidades carregadas:', connection.entityMetadatas.map(meta => meta.name));

  // Verifica se a conexão está funcionando
  const userRepo = getRepository(User);
  const count = await userRepo.count();
  console.log(`Banco de dados conectado com sucesso. Total de usuários: ${count}`);

  return connection;
}

async function startServer() {
  try {
    // Inicializa o banco de dados primeiro
    await initializeDatabase();

    const app = express();

    // Configuração do CORS
    const corsOptions = {
      origin: ['http://localhost:5173', 'http://localhost:5175'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200
    };
    
    app.use(cors(corsOptions));
    console.log('CORS configurado:', corsOptions);

    // Middleware
    app.use(express.json());

    // Log de requisições
    app.use((req, _res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
      console.log('Headers:', req.headers);
      console.log('Body:', req.body);
      next();
    });

    // Rotas
    app.use('/api', routes);

    // Inicialização do servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Frontend deve estar rodando em: http://localhost:5173`);
      console.log(`API disponível em: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

startServer(); 