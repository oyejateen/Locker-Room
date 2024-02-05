const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const fs = require('fs');
const app = express();
const path = require('path');
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join(__dirname,'./views')));
const greetings = [
  "Welcome to the chat!",
  "Glad to have you here!",
  "Hey there, nice to see you!",
  "Hello and welcome!",
  "We're glad you joined us!",
  "It's great to have you on board!",
  "Welcome aboard!",
  "We're happy to have you join us!",
  "It's a pleasure to have you here!",
  "We're glad you're here with us!"
];

const randomIndex = Math.floor(Math.random() * greetings.length);

app.get("/", (req, res) => {
  res.sendFile("main.html", {root: "./views"})
})

const activeUsers = new Set();

io.on('connection', socket => {
  console.log('a user connected');
  
socket.on('set username', username => {
    socket.username = username;
    activeUsers.add(username);
  socket.emit('current users', Array.from(activeUsers));
    io.emit('new user', `${socket.username} has joined the chat, ${greetings[randomIndex]}`);
  console.log(socket.username)
  });

  socket.on('send message', message => {
    
    io.emit('message', message);
     
  });
  socket.on('send image1', imageData => {
console.log(imageData)
    const imageBuffer = Buffer.from(imageData.file);
const image = imageBuffer.toString('base64');
console.log(image)
const name = imageData.username;
    console.log(name)
    io.emit('get image1', {
      image: image,
      name: name
    });
     
  });
  socket.on('send image', imageData => {
console.log(imageData)
    const imageBuffer = Buffer.from(imageData.file);
const image = imageBuffer.toString('base64');
console.log(image)
const name = imageData.username;
    console.log(name)
    io.emit('get image', {
      image: image,
      name: name
    });
     
  });

socket.on('sendvideo', videoData => {
  console.log("video data aaa gya")
  console.log(videoData);
    const imageBuffer = Buffer.from(videoData.file);
const video = imageBuffer.toString('base64');
console.log(video)
  const name = videoData.username;
  console.log(name);
  io.emit('get video', {
    video: video,
    name: name
  });
});

socket.on('sendaudio', audioData => {
  console.log("audio data aaa gya")
  console.log(audioData);
    const imageBuffer = Buffer.from(audioData.file);
const audio = imageBuffer.toString('base64');
console.log(audio)
  const name = audioData.username;
  console.log(name);
  io.emit('get audio', {
    audio: audio,
    name: name
  });
});


  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (socket.username) {
      activeUsers.delete(socket.username);
      io.emit('user disconnected', socket.username);
    }
  });
});
app.get('*', function(req, res){
res.status(404).redirect('https://locker-room.iiiv.repl.co/upload')
})
const port = process.env.PORT || 0000;
server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});