const socketIO = require('socket.io')

module.exports =  server => {
  const io = socketIO(server)
  const ot = require('ot')
  const roomList = []

  io.on('connection', socket => {
    const str = 'This is a Markdown heading \n\n' +
                'const i = 1 + 1;'

    socket.on('joinRoom', data => {
      if (!roomList[data.room]) {
        const socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, function(socket, cb) {
          const self = this;
          Task.findByIdAndUpdate(data.room, { content: self.document }, err => {
            if (err) return cb(false);
            cb(true);
          });

        });

        roomList[data.room] = socketIOServer
      }

      roomList[data.room].addClient(socket)
      roomList[data.room].setName(socket, data.username)

      socket.room = data.room
      socket.join(data.room)
    })

    socket.on('chatMessage', data => {
      io.to(socket.room).emit('chatMessage', data)
    })

    socket.on('disconnect', () => {
      socket.leave(socket.room)
    })
  })
}