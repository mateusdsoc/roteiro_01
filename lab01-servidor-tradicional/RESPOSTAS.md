# Questões para responder

1. Com 1000 usuários simultâneos o sistema ficaria lento e ineficiente, porque estamos utilizando Node.js que mantém uma fila única no sistema (Event Loop) e o SQLite que só permite que uma pessoa escreva por vez, se por exemplo 100 usuários tentarem salvar tarefas ao mesmo tempo o sqlite vai travar 99.

2. Se considerarmos que não temos cópias rodando, quase tudo é ponto de falha, a máquina física rodando (se falhar o sistema cai), um único processo Node.js e somente um arquivo SQLite. Se o terminal fechar, o servidor cai para todos, se o arquivo tasks.db tiver algum problema perde-se tudo. Para resolver isso seria adicionar backups, cópias e etc...

3. Um gargalo que impacta bastante no sistema é o SQLite, embora ele garante que nada que alguém escrever será sobrescrito ou ocorrerá algum tipo de defeito por concorrênica, ele também impede que mais de um usuário escreva ao mesmo tempo, devido ao bloqueio de escrita simultânea.

4. Para atualizar a aplicação, ocorrerá o downtime. Sob a ótica do código, se for preciso mudar uma linha em um arquivo, por exemplo no route.js, é preciso derrubar o servidor, implementar a mudança e subir de novo. Enquanto isso ocorre o servidor estará em "downtime".

5. Visando expandir a aplicação para outras regiões, como outros países pro exemplo, seria necessário (para motivos de usabilidade, como diminuir a latência) aplicar um servidor perto dessas regiões. Entretanto, está sendo utilizado o SQLite e ele não conversa em rede, então teria que ser substituído por um banco de dados distribuído. Além disso, seria necessário ter o código rodando em várias máquinas separadas, com um Load Balancer para jogar o usuário em servidores mais perto dele.