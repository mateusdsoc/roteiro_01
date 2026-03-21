# Documentação da API - Task Management

**URL base:** `http://localhost:3000`

## Autenticação

A API usa JWT (JSON Web Token). Para acessar as rotas de tarefas, é necessário enviar o token no header:

```
Authorization: Bearer <seu_token>
```

O token é obtido no login ou registro e expira em 24 horas.

---

## Endpoints

### Registrar Usuário — `POST /api/auth/register`

```json
{
  "email": "user@test.com",
  "username": "testuser",
  "password": "123456",
  "firstName": "João",
  "lastName": "Silva"
}
```

Retorna os dados do usuário criado e o token JWT.

---

### Login — `POST /api/auth/login`

```json
{
  "identifier": "user@test.com",
  "password": "123456"
}
```

O campo `identifier` aceita email ou username. Retorna o token JWT.

---

### Listar Tarefas — `GET /api/tasks` (autenticado)

Parâmetros opcionais na URL: `page`, `limit`, `completed`, `priority`.

Exemplo: `GET /api/tasks?page=1&limit=5&priority=high`

Retorna a lista de tarefas do usuário com dados de paginação.

---

### Criar Tarefa — `POST /api/tasks` (autenticado)

```json
{
  "title": "Estudar para a prova",
  "description": "Capítulos 3 e 4",
  "priority": "high"
}
```

O campo `title` é obrigatório. `priority` aceita: low, medium, high, urgent (padrão: medium).

---

### Buscar Tarefa — `GET /api/tasks/:id` (autenticado)

Retorna uma tarefa específica pelo ID.

---

### Atualizar Tarefa — `PUT /api/tasks/:id` (autenticado)

```json
{
  "title": "Título atualizado",
  "description": "Nova descrição",
  "completed": true,
  "priority": "low"
}
```

---

### Deletar Tarefa — `DELETE /api/tasks/:id` (autenticado)

Remove a tarefa do banco de dados.

---

### Estatísticas — `GET /api/tasks/stats/summary` (autenticado)

Retorna total de tarefas, quantidade completas, pendentes e taxa de conclusão.

---

### Health Check — `GET /health`

Retorna o status do servidor, timestamp e uptime.

---

### Logs — `GET /api/logs`

Retorna os últimos logs do servidor em formato JSON.

---

> (autenticado) = Requer token JWT no header Authorization
