const socketClient = io();

const formMsg = document.getElementById("chatForm");
const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const user = document.getElementById("user");

socketClient.emit('showMsg')

const render = (e) => {
  e.forEach((e) => {
    let div = document.createElement("div");
    div.innerHTML = `
    <p>${e.user}:</p>
    <p>${e.message}</p>
    `;
    chat.appendChild(div);
  });
};

socketClient.on('alert', (e) => {
  alert('Mensaje enviado')
  console.log(e);
})

socketClient.on("msgs", (e) => {
  chat.innerHTML = "";
  render(e)
});

formMsg.onsubmit = (e) => {
  e.preventDefault();
  const mssg = {
    user: user.value,
    message: msg.value,
  };
  user.value = "";
  msg.value = "";
  socketClient.emit("msg", mssg);
};
