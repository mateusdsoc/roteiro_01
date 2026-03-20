# Documentação da API - Task Management

## Visão Geral

API REST para gerenciamento de tarefas (To-Do List), feita com Node.js e Express. Usa SQLite como banco de dados e JWT para autenticação.

**URL base:** `http://localhost:3000`

---

## Autenticação

A API utiliza token JWT (JSON Web Token). Para acessar as rotas de tarefas, é necessário enviar o token no header `Authorization` no formato:

```
Authorization: Bearer <seu_token>
```

O token é gerado no login/registro e expira em 24 horas.

---

## Endpoints

### 1. Registrar Usuário

- **URL:** `POST /api/auth/register`
- **Autenticação:** Não precisa

**Body (JSON):**
```json
{
  "email": "user@test.com",
  "username": "testuser",
  "password": "123456",
  "firstName": "João",
  "lastName": "Silva"
}
```

**Resposta (201 - Criado):**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "user": {
      "id": "uuid-gerado",
      "email": "user@test.com",
      "username": "testuser",
      "firstName": "João",
      "lastName": "Silva"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Erros possíveis:**
- `400` - Dados inválidos (campo faltando ou formato errado)
- `409` - Email ou username já existe

---

### 2. Login

- **URL:** `POST /api/auth/login`
- **Autenticação:** Não precisa

**Body (JSON):**
```json
{
  "identifier": "user@test.com",
  "password": "123456"
}
```

O campo `identifier` aceita tanto email quanto username.

**Resposta (200 - OK):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "uuid-do-usuario",
      "email": "user@test.com",
      "username": "testuser",
      "firstName": "João",
      "lastName": "Silva"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Erros possíveis:**
- `401` - Credenciais inválidas

---

### 3. Listar Tarefas

- **URL:** `GET /api/tasks`
- **Autenticação:** Obrigatória

**Parâmetros de query (opcionais):**

| Parâmetro | Tipo | Descrição |
| :--- | :--- | :--- |
| `page` | number | Página atual (padrão: 1) |
| `limit` | number | Itens por página (padrão: 10, máx: 100) |
| `completed` | boolean | Filtrar por status (true/false) |
| `priority` | string | Filtrar por prioridade (low, medium, high, urgent) |

**Exemplo:** `GET /api/tasks?page=1&limit=5&priority=high`

**Resposta (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-da-tarefa",
      "title": "Minha Tarefa",
      "description": "Descrição aqui",
      "completed": false,
      "priority": "high",
      "userId": "uuid-do-usuario",
      "createdAt": "2026-03-19T12:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 12,
    "itemsPerPage": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 4. Criar Tarefa

- **URL:** `POST /api/tasks`
- **Autenticação:** Obrigatória

**Body (JSON):**
```json
{
  "title": "Estudar para a prova",
  "description": "Capítulos 3 e 4 do livro",
  "priority": "high"
}
```

| Campo | Obrigatório | Valores |
| :--- | :---: | :--- |
| `title` | Sim | Texto (1-200 caracteres) |
| `description` | Não | Texto (até 1000 caracteres) |
| `priority` | Não | low, medium, high, urgent (padrão: medium) |

**Resposta (201):**
```json
{
  "success": true,
  "message": "Tarefa criada com sucesso",
  "data": {
    "id": "uuid-gerado",
    "title": "Estudar para a prova",
    "description": "Capítulos 3 e 4 do livro",
    "completed": false,
    "priority": "high",
    "userId": "uuid-do-usuario"
  }
}
```

---

### 5. Buscar Tarefa por ID

- **URL:** `GET /api/tasks/:id`
- **Autenticação:** Obrigatória

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-da-tarefa",
    "title": "Minha Tarefa",
    "description": "Descrição",
    "completed": false,
    "priority": "high",
    "userId": "uuid-do-usuario",
    "createdAt": "2026-03-19T12:00:00.000Z"
  }
}
```

**Erros possíveis:**
- `404` - Tarefa não encontrada

---

### 6. Atualizar Tarefa

- **URL:** `PUT /api/tasks/:id`
- **Autenticação:** Obrigatória

**Body (JSON):**
```json
{
  "title": "Tarefa atualizada",
  "description": "Nova descrição",
  "completed": true,
  "priority": "low"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Tarefa atualizada com sucesso",
  "data": { ... }
}
```

**Erros possíveis:**
- `404` - Tarefa não encontrada

---

### 7. Deletar Tarefa

- **URL:** `DELETE /api/tasks/:id`
- **Autenticação:** Obrigatória

**Resposta (200):**
```json
{
  "success": true,
  "message": "Tarefa deletada com sucesso"
}
```

**Erros possíveis:**
- `404` - Tarefa não encontrada

---

### 8. Estatísticas

- **URL:** `GET /api/tasks/stats/summary`
- **Autenticação:** Obrigatória

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 4,
    "pending": 6,
    "completionRate": "40.00"
  }
}
```

---

### 9. Health Check

- **URL:** `GET /health`
- **Autenticação:** Não precisa

**Resposta (200):**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-19T12:00:00.000Z",
  "uptime": 1234.56
}
```

---

### 10. Logs Recentes

- **URL:** `GET /api/logs`
- **Autenticação:** Não precisa
- **Query:** `?quantidade=20` (padrão: 50)

Retorna os últimos N logs do servidor em formato JSON, útil para debugging.

---

## Headers de Rate Limit

Requisições autenticadas retornam headers informativos sobre o rate limit do usuário:

| Header | Descrição |
| :--- | :--- |
| `X-RateLimit-Limit` | Total de requisições permitidas (100) |
| `X-RateLimit-Remaining` | Quantas ainda restam |
| `X-RateLimit-Reset` | Segundos até o contador resetar |

Se o limite for excedido, a API retorna status `429` com a mensagem de erro.

---

## Códigos de Erro

| Código | Significado |
| :---: | :--- |
| 200 | Tudo certo |
| 201 | Recurso criado com sucesso |
| 400 | Dados inválidos no body |
| 401 | Token ausente ou inválido |
| 404 | Recurso não encontrado |
| 409 | Conflito (email/username já existe) |
| 429 | Muitas requisições (rate limit) |
| 500 | Erro interno do servidor |
