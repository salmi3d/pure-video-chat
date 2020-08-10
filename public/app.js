const socket = io('/')
const app = document.getElementById('app')
const ownPeer = new Peer(undefined, {
  host: location.hostname,
  port: 9000,
})
const ownVideo = document.createElement('video')
ownVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(strem => {
  addVideoStream(ownVideo, strem)
  ownPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', clientVideoStrem => addVideoStream(video, clientVideoStrem))
  })
  socket.on('client-connected', clientId => connectToNewClient(clientId, strem))
})

socket.on('client-disconnected', clientId => {
  if (peers[clientId]) peers[clientId].close()
})

ownPeer.on('open', id => socket.emit('join-room', ROOM_ID, id))

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => video.play())
  app.append(video)
}

const connectToNewClient = (clientId, strem) => {
  const call = ownPeer.call(clientId, strem)
  const video = document.createElement('video')
  call.on('stream', clientVideoStrem => addVideoStream(video, clientVideoStrem))
  call.on('close', video.remove)
  peers[clientId] = call
}
