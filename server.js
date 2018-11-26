const io = require('socket.io')()

io.on('connection', (client) => {
    client.on('pushGameboard', (slots) => {
        io.emit('updateGameboard', slots);
        console.log('emitting')
      })
})

const port = process.env.PORT;
io.listen(port);
console.log('listening on port', port);