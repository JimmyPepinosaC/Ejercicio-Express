const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (msg) => {
  renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
  const html = data.map((item) => `<p>${item}</p>`).join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  console.log(message);
  let date = new Date();

  const body = {message: message.value, author: "Jimmy PepinosaFRONT", ts: date.getDate().toString()};
  const bodyjson = JSON.stringify(body);
  console.log(bodyjson);
  fetch("http://localhost:3000/chat/api/messages/", {
    method: "POST", 
    body: bodyjson, 
    headers: {
    'Content-Type': 'application/json'}
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Something went wrong on api server!');
    }
  })
  .then(response => {
    console.debug(response);
    // ...
  }).catch(error => {
    console.error(error);
  });

  //ws.send(message.value);
  message.value = "";
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);