// Realiza o require do express, http, e socketio
let app = require('express')();

// passa o express para o http-server
let http = require('http').Server(app);

// passa o http-server par ao socketio
let io = require('socket.io')(http);

// inicia o servidor na porta informada, no caso vamo iniciar na porta 3000
let porta = process.env.PORT || 3000

if(porta === 3000) {
  io.set('origins', [
    'projetos.pc:*', 
  ]);
} else {
  io.set('origins', [
    'ofc.exbrhb.net:*', 
    'pracas.exbrhb.net:*', 
  ]);
}

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

let onlines = {}

// sempre que o socketio receber uma conexão vai devoltar realizar o broadcast dela
io.on('connection', socket => {
  
  socket.on('entrar', usuario => {
    onlines[socket.id] = usuario;

    io.emit('online', {...onlines});
  });

  socket.on('patrulhas_add', patrulha => {
    io.emit('nova_patrulha', patrulha);
  });

  socket.on('finalizarPatrulha', patrulha_id => {
    io.emit('fim_patrulha', patrulha_id)
  })

  socket.on('relatorio_treino', relatorio => {    
    io.emit('add_relatorio', relatorio)
  })

  socket.on('atualizarRelatorio', relatorio => {    
    io.emit('relatorio_atualizar', relatorio)
  })

  socket.on('marcar_erro', id => {    
    io.emit('relatorio_errado', id)
  })

  socket.on('room', roomName => {
    socket.join(roomName)
  })

  socket.on('rmo_add', rmoMembro => {
    io.to('ofcsuperiores').emit('novo_membrormo', rmoMembro)
  })

  socket.on('rmo_pegou', responsavel => {
    io.to('ofcsuperiores').emit('new_responsavel', responsavel)
  })

  socket.on('iniciarRMO', () => {
    io.to('ofcsuperiores').emit('new_rmo')
  })

  socket.on('finalziarRMO', () => {
    io.to('ofcsuperiores').emit('rmo_ended')
  })

  socket.on('atualizar_status', membro => {
    io.to('ofcsuperiores').emit('status_updateded', membro)
  })

  //io.to('some room').emit('some event');

  socket.on('disconnect', () => {    
    // remove saved socket from users object
    delete onlines[socket.id];
    io.emit('online', {...onlines});
  });

});

http.listen(porta, function(){
  console.log('Servidor rodando em: ', porta);
});