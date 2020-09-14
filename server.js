// Realiza o require do express, http, e socketio
let app = require('express')();

// passa o express para o http-server
let http = require('http').Server(app);

// passa o http-server par ao socketio
let io = require('socket.io')(http);
io.set('origins', [
  'projetos.pc/ofc/central:*', 
  'projetos.pc/ofc/relatorios/enviar:*',
  'projetos.pc/pracas/:*', 
  'projetos.pc/pracas/criar/enviar:*', 

  'ofc.exbrhb.net/central:*', 
  'ofc.exbrhb.net/relatorios/enviar:*',
  'pracas.exbrhb.net/central:*', 
  'pracas.exbrhb.net/criar/enviar:*', 
]);


// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

let onlines = {}

// sempre que o socketio receber uma conexão vai devoltar realizar o broadcast dela
io.on('connection', function(socket){
  
  socket.on('entrar', function(usuario){
    onlines[socket.id] = usuario;

    io.emit('online', {...onlines});
  });

  socket.on('patrulhas_add', function(patrulha){
    io.emit('nova_patrulha', patrulha);
  });

  socket.on('finalizarPatrulha', function(patrulha_id) {
    io.emit('fim_patrulha', patrulha_id)
  })

  socket.on('relatorio_treino', function(relatorio) {    
    io.emit('add_relatorio', relatorio)
  })

  socket.on('atualizarRelatorio', function(relatorio) {    
    io.emit('relatorio_atualizar', relatorio)
  })

  socket.on('marcar_erro', function(id) {    
    io.emit('relatorio_errado', id)
  })

  socket.on('disconnect', function(){    
    // remove saved socket from users object
    delete onlines[socket.id];
    io.emit('online', {...onlines});
  });

});

// inicia o servidor na porta informada, no caso vamo iniciar na porta 3000
let porta = process.env.PORT || 3000
http.listen(porta, function(){
  console.log('Servidor rodando em: ', porta);
});