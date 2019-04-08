const EditorClient = ot.EditorClient;
const SocketIOAdapter = ot.SocketIOAdapter;
const CodeMirrorAdapter = ot.CodeMirrorAdapter;

const socket = io.connect('http://localhost:3000')

// config code editor
const editor = CodeMirror.fromTextArea(document.getElementById('code-screen'), {
  lineNumbers: true,
  theme: 'monokai',
  mode: "javascript"
})

const code = $('#code-screen').val();
let cmClient;

function init(str, revision, clients, serverAdapter) {
  if (!code) {
    editor.setValue(str);
  }

  cmClient = window.cmClient = new EditorClient(
    revision, clients, serverAdapter, new CodeMirrorAdapter(editor)
  );
};

socket.on('doc', obj => {
  init(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socket))
})

// get the username from chatbox
let username = $('#chatbox-username').val();

// if there is no username, generate a random one
if (username === '') {
  const userId = Math.floor(Math.random() * 9999).toString()
  username = `User${userId}`
  $('#chatbox-username').text(username)
}

const chatInput = document.getElementById("userMessage");

// send message if user presses enter key
chatInput.addEventListener("keyup", event => {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage();
  }
});

const roomId = $('#roomId').val();
socket.emit('joinRoom', { room: roomId, username: username })

const generateUserMessage = (name, text) => {
  return (
    '<li class="media"> <div class="media-body"> <div class="media">' +
    '<div class="media-body"' +
    '<b>' + name + '</b> : ' + text +
    '<hr/> </div></div></div></li>'
  );
};

const sendMessage = () => {
  const userMessage = $('#userMessage').val();

  socket.emit('chatMessage', { message: userMessage, username: username });

  $('#userMessage').val("");
};

socket.on('chatMessage', data => {
  $('#chatbox-listMessages').append(generateUserMessage(data.username, data.message));
});