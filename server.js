const path = require('path')
const express = require('express')
const config = require('./config.json')
const fs = require('fs')
const http = require('http')
const https = require('https')
const socketIo = require('socket.io')
const app = express()
const options = {}
if (config.secure) {
  options.key = fs.readFileSync('sis-key.pem')
  options.cert = fs.readFileSync('sis-cert.pem')
}
const server = config.secure ? https.createServer(options, app) : http.Server(app)
const io = config.secure ? socketIo(server, options) : socketIo(server)

console.log(`config.secure = ${config.secure}`)

app.use(express.static(path.join(__dirname, 'public')))
const state = []
let events = {}
const seed = Math.random().toString()
console.log('seed = ' + seed)

app.get('/', (request, response) =>
  response.sendFile(path.join(__dirname, 'public', 'client.html'))
)

io.on('connection', async socket => {
  console.log('socket.id =', socket.id)
  socket.emit('setup', { seed, state })
  socket.on('updateServer', msg => {
    if (msg.seed === seed) {
      msg.updates.forEach(update => {
        state[update.id] = update
        events[update.id] = { socket, update }
      })
    }
  })
})

async function updateClients () {
  const values = Object.values(events)
  if (values.length === 0) return
  const sockets = await io.fetchSockets()
  sockets.forEach(socket => {
    const updates = values
      .filter(event => event.socket !== socket)
      .map(event => event.update)
    const msg = { seed, updates }
    if (updates.length > 0) socket.emit('updateClient', msg)
  })
  events = {}
}

server.listen(3000, () => {
  const port = server.address().port
  console.log(`listening on port: ${port}`)
})

setInterval(updateClients, 100)
