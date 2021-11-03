var express = require('express')
var app = express()
var http = require('http').Server(app)
const io = require('socket.io')(http)
const axios = require('axios').default

const PORT = process.env.PORT || 7000
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function (socket) {
  socket.on('message', async (msg) => {
    console.log('message: ' + msg)
    io.emit('message', msg.replace(/\r?\n/g, '<br>'))

    console.log('api-free.deepl.com翻訳 start')
    const params = new URLSearchParams()
    params.append('auth_key', 'b8be36-0e90-da8f-0e31-ecc7XXX74cfa3:fx')
    params.append('text', msg)
    params.append('target_lang', 'JA')
    const result = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      params
    )
    result.data.translations.forEach((translation, index) => {
      io.emit('deepl', translation.text.replace(/\r?\n/g, '<br>'))
    })
  })
})

http.listen(PORT, function () {
  console.log('server listening. Port:' + PORT)
})
