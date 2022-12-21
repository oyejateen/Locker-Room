const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
var name;
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

// Use Math.random() to randomly select an index from the greetings array
const randomIndex = Math.floor(Math.random() * greetings.length);

app.get("/", (req, res) => {
  res.render("main.ejs", {root: "."})
})
io.on('connection', socket => {
  console.log('a user connected');
  
  /*socket.on('joining msg', (username) => {
    name = username
socket.broadcast.emit('new user', `${name} joined the chat, ${greetings[randomIndex]}`);
console.log(name, username)

  });*/
socket.on('set username', username => {
    socket.username = username;
    socket.broadcast.emit('new user', `${socket.username} has joined the chat, ${greetings[randomIndex]}`);
  console.log(socket.username)
  });

  socket.on('send message', message => {
    
    io.emit('message', message);
     
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
app.get('*', function(req, res){
res.status(404).redirect('https://timecapsule.jatinsharma24.repl.co/upload')
})
const port = process.env.PORT || 0000;
server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});