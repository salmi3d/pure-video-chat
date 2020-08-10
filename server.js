require('dotenv').config()
const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const { PeerServer } = require('peer')
const { v4: uuid } = require('uuid')


const PORT = process.env.PORT || 8080
const PEER_PORT = process.env.PEER_PORT || 9000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use('/', express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
  res.redirect(`/${uuid()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, clientId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('client-connected', clientId)
    socket.on('disconnect', () => socket.to(roomId).broadcast.emit('client-disconnected', clientId))
  })
})

server.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`)
  PeerServer({ port: PEER_PORT })
})
