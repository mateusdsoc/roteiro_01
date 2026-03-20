# Análise de Performance e Limitações Arquiteturais

## 1. Análise de Performance

Nos testes locais, a API respondeu com latência média de ~5ms por requisição sem cache e ~3ms com cache ativado. O tempo de startup do servidor ficou abaixo de 1 segundo, e o uso de memória ficou entre 50-100MB.

Esses números são bem baixos porque o SQLite roda localmente como um arquivo no disco, sem precisar de conexão de rede com um banco externo. Em um cenário real com banco remoto, a latência subiria bastante e o cache faria uma diferença muito maior.

O cache em memória que implementamos mostrou o comportamento esperado: a primeira consulta vai ao banco (MISS), a segunda responde direto da memória (HIT), e quando os dados são modificados o cache é invalidado corretamente.

---

## 2. Limitações Arquiteturais

### Ponto único de falha
Toda a aplicação roda em um único processo Node.js. Se esse processo crashar, todo o sistema fica fora do ar. Não existe nenhum backup ou redundância — é só matar o processo e acabou.

### Escalabilidade limitada
A única forma de escalar essa arquitetura é **verticalmente**, ou seja, colocar mais RAM ou CPU na máquina. Não dá pra simplesmente rodar duas cópias do servidor porque o SQLite é um banco local e não suporta múltiplos acessos simultâneos de processos diferentes.

### Estado centralizado
Tudo fica no mesmo lugar: o servidor, o banco de dados, o cache, os logs. Se a máquina tiver algum problema, perdemos tudo. Em uma arquitetura distribuída, esses componentes estariam separados.

### Sem distribuição de carga
Se tivermos 5000 usuários acessando ao mesmo tempo, todas as requisições vão para o mesmo servidor. Não existe um load balancer para distribuir entre várias instâncias.

### Banco de dados SQLite
O SQLite é ótimo pra prototipação e aplicações simples, mas tem limitações sérias pra produção:
- Não suporta bem escritas concorrentes (uma escrita bloqueia todo o banco)
- Não roda como servidor separado (é apenas um arquivo)
- Difícil de fazer backup em tempo real

### Cache em memória local
O cache que implementamos fica na RAM do processo. Se reiniciar o servidor, o cache é perdido. Em produção, seria melhor usar algo como Redis, que é um cache compartilhado entre servidores.

---

## 3. Comparação com Outras Arquiteturas

| Aspecto | Tradicional (este projeto) | gRPC | Microsserviços | Serverless |
| :--- | :---: | :---: | :---: | :---: |
| Complexidade | Baixa | Média | Alta | Média |
| Performance | Baseline | +60% | Variável | Variável |
| Escalabilidade | Limitada | Boa | Excelente | Automática |
| Manutenção | Simples | Média | Complexa | Mínima |
| Custo | Fixo | Fixo | Alto | Sob demanda |

Essa arquitetura cliente-servidor tradicional serve como uma boa base para entender os conceitos, mas em um cenário real com muitos usuários, seria necessário evoluir para uma das alternativas acima.
