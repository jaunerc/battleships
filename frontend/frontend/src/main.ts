import './style.css'

const webSocket: WebSocket = new WebSocket('ws://localhost:3001');
let username: string | undefined = undefined;

webSocket.onopen = () => {
    console.log('websocket connected');
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div>
        <label for="username">Please type your username</label>
        <input id="username"/>
        <button id="submit">Submit</button>
      </div>
    `
    const submitButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#submit')!;
    submitButton.addEventListener('click', onSubmitClick);
}

interface WebsocketMessage {
    messageType: 'READY' | 'SEND_USERNAME';
    username?: string;
}

webSocket.onmessage = (message: MessageEvent<string>) => {
    const websocketMessage: WebsocketMessage = JSON.parse(message.data);

    switch (websocketMessage.messageType) {
        case "READY":
            onReadyMessage();
    }
}

function onSubmitClick(): void {
    username = document.querySelector<HTMLInputElement>('#username')?.value;
    const websocketMessage: WebsocketMessage = { messageType: 'SEND_USERNAME', username: username};
    webSocket.send(JSON.stringify(websocketMessage));

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div>
            <p>Your Username: ${username}</p>
        </div>
    `
}

function onReadyMessage(): void {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div>
            <p>Battle!</p>
        </div>
    `
}
