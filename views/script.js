const socket = io();

const form = document.getElementById('message-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');
const loginForm = document.getElementById("login-form");
const submitButton = document.getElementById("submit-button");

submitButton.addEventListener("click", event => {
  event.preventDefault();
  console.log('button is clicked')

  if (!document.getElementById("username").value) {
    alert('Bruhh Please Enter Your Name first')
  } else {
    const chatContainer = document.querySelector('.chat-container');

    const username = document.getElementById("username").value;
    socket.emit('set username', username);

    chatContainer.style.display = "flex";

    document.querySelector('.secret').style.display = "none";
    document.querySelectorAll('.secret *').forEach(element => {
      element.style.display = 'none';
    });

  }
});
const clientName = document.getElementById("username").value;
const fileInput = document.getElementById('file-input-image');
const fileInput0 = document.getElementById('file-input-camera');
const fileInput2 = document.getElementById('file-input-video');
const fileInput3 = document.getElementById('file-input-audio');
const addFileIconButton = document.getElementById('plusandcloseicon');
const addFileButton = document.getElementById('add-file-button');
const fileOptions = document.getElementById('file-options');

addFileButton.addEventListener('click', () => {
  console.log("add file button clicked");

  if (fileOptions.style.display === 'none') {
    console.log("displaying file options");
    addFileIconButton.className = "fa fa-close";
    fileOptions.style.display = 'flex';
  } else if (fileOptions.style.display === 'flex') {
    console.log("hiding file options");
    addFileIconButton.className = "fa fa-plus";
    fileOptions.style.display = 'none';
  }
});


fileInput0.addEventListener('change', () => {
  socket.emit('send image1', {
    file: fileInput.files[0],
    username: document.getElementById("username").value + ' has sent a photo'
  })
  console.log(fileInput.files);
});
fileInput.addEventListener('change', () => {
  socket.emit('send image', {
    file: fileInput.files[0],
    username: document.getElementById("username").value + ' has sent a photo'
  })
  console.log(fileInput.files);
});


fileInput2.addEventListener('change', async () => {
  const file = fileInput2.files[0];
  console.log("new file has been uploaded", `\n\n`, file);
  socket.emit('sendvideo', {
    file: file,
    username: document.getElementById("username").value + ' has sent a video'
  });
  console.log("bhai socket emit ker diya hai")
});

fileInput3.addEventListener('change', async () => {
  const file = fileInput3.files[0];
  console.log("new file has been uploaded", `\n\n`, file);
  socket.emit('sendaudio', {
    file: file,
    username: document.getElementById("username").value + ' has sent an audio'
  });
  console.log("bhai socket emit ker diya hai")
});

const threeDots = document.getElementById("threeDots");
const menuContainer = document.querySelector(".menu-container");
const closeButton = document.querySelector(".close-button");
const shareButton = document.querySelector(".share-button");


threeDots.addEventListener("click", () => {
  menuContainer.style.display = "flex";
});

closeButton.addEventListener("click", () => {
  menuContainer.style.display = "none";
});

shareButton.addEventListener("click", async () => {
  menuContainer.style.display = "none";

  try {
    await navigator.share({
      url: window.location.href,
      title: `Yo! join this completely anonymous room.`,
    });
  } catch (error) {
    console.error('Error sharing:', error);
  }
});

document.addEventListener("click", (event) => {
  if (!menuContainer.contains(event.target) && !threeDots.contains(event.target)) {
    menuContainer.style.display = "none";
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  socket.emit('send message', (document.getElementById("username").value + ':  ' + input.value));
  input.value = '';
});
const messages1 = document.querySelector('#messages');

function scrollToBottom() {
  const scrollHeight = messages.scrollHeight;
  const scrollTop = messages.scrollTop;
  const clientHeight = messages.clientHeight;
  if (scrollTop + clientHeight >= scrollHeight) {
    messages.scrollTo(0, scrollHeight);
  }
}
socket.on('message', (message) => {
  const li = document.createElement('li');
  li.innerHTML = convertURLsToLinks(message);
  li.style.color = 'black';
  messages.appendChild(li);
  scrollToBottom();
});

function convertURLsToLinks(message) {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  const containsURL = urlRegex.test(message);
  
  if (containsURL) {
    return message.replace(urlRegex, function(url) {
      return '<a style="text-decoration:none;" href="' + url + '" target="_blank">' + url + '</a>';
    });
  } else {
    return message;
  }
}

/*socket.on('message', message => {

  const li = document.createElement('li');
  li.textContent = message;
  li.style.color = "black";
  messages.appendChild(li);
  scrollToBottom();
});*/
socket.on('get image1', data => {
  const li = document.createElement('li');
  li.textContent = data.name;

  const anchor = document.createElement('a');
  anchor.href = 'data:image/*;base64,' + data.image;
  anchor.target = '_blank';
  anchor.style.textDecoration = 'none';
  anchor.removeAttribute('download');
  const img = document.createElement('img');
  img.src = 'data:image/*;base64,' + data.image;
  img.classList.add('image');
  img.style.maxWidth = "300px";
  img.style.maxHeight = "300px";

  anchor.appendChild(img);
  li.appendChild(anchor);

  messages.appendChild(li);
  scrollToBottom();
});
socket.on('get image', data => {
  const li = document.createElement('li');
  li.textContent = data.name;

  const anchor = document.createElement('a');
  anchor.href = 'data:image/*;base64,' + data.image;
  anchor.target = '_blank';
  anchor.style.textDecoration = 'none';
  anchor.removeAttribute('download');
  const img = document.createElement('img');
  img.src = 'data:image/*;base64,' + data.image;
  img.classList.add('image');
  img.style.maxWidth = "300px";
  img.style.maxHeight = "300px";

  anchor.appendChild(img);
  li.appendChild(anchor);

  messages.appendChild(li);
  scrollToBottom();
});

socket.on('get video', data => {
  const li = document.createElement('li');
  li.textContent = data.name;

  const video = document.createElement('video');
  video.classList.add('video');
  video.controls = true;
  video.style.maxWidth = "400px";
  video.style.maxHeight = "300px";

  const source = document.createElement('source');
  source.src = 'data:video/*;base64,' + data.video;
  source.type = 'video/mp4';

  video.appendChild(source);
  li.appendChild(video);
  messages.appendChild(li);
  scrollToBottom();
});

socket.on('get audio', data => {
  const li = document.createElement('li');
  li.textContent = data.name;

  const audio = document.createElement('audio');
  audio.classList.add('audio');
  audio.controls = true;
  audio.style.maxWidth = '400px';

  const source = document.createElement('source');
  source.src = 'data:audio/*;base64,' + data.audio;
  source.type = 'audio/mp3';

  audio.appendChild(source);
  li.appendChild(audio);

  messages.appendChild(li);
  scrollToBottom();
});


const usersContainer = document.querySelector('.total-users');
const users = new Set();

function renderUsers() {
  usersContainer.innerHTML = '';

  for (const username of users) {
    const listItem = document.createElement('li');
    listItem.textContent = `• ${username}`;
    listItem.style.margin = '5px';
    listItem.style.marginLeft = '20px';
    usersContainer.appendChild(listItem);
  }
}

socket.on('current users', userList => {
  for (const username of userList) {
    users.add(username);
  }
  renderUsers();
});

socket.on('new user', message => {
  const li = document.createElement('li');
  li.innerHTML = `🎉 ${message}`;
  li.id = 'new-user-message';
  messages.appendChild(li);
  const username = message.split(' ')[0];
  users.add(username);
  renderUsers();
});

socket.on('user disconnected', username => {
  users.delete(username);
  renderUsers();
});