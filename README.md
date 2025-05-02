# Meal Planner

Aplicativo de planejamento de refeições com base em estoque, que sugere receitas com base nos ingredientes disponíveis.

## Funcionalidades

- Gerenciamento de estoque de ingredientes
- Rastreamento de datas de validade
- Sugestão de receitas baseadas nos ingredientes disponíveis
- Integração com a API Spoonacular para busca de receitas
- Previsão de preferências alimentares usando machine learning

## Requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- SQLite

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/meal-planner.git
cd meal-planner
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente no arquivo `.env`:
- `SPOONACULAR_API_KEY`: Sua chave de API do Spoonacular
- `JWT_SECRET`: Uma string secreta para autenticação JWT

## Executando o Projeto

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm run build
npm start
```

## Estrutura do Projeto

```
src/
├── entities/         # Entidades do banco de dados
├── controllers/      # Controladores da API
├── services/         # Serviços de negócio
├── routes/           # Rotas da API
├── middlewares/      # Middlewares
└── utils/            # Utilitários
```

## API Endpoints

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/ingredients` - Listar ingredientes
- `POST /api/ingredients` - Adicionar ingrediente
- `GET /api/recipes` - Listar receitas sugeridas
- `POST /api/recipes/suggest` - Sugerir receitas baseadas no estoque

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 