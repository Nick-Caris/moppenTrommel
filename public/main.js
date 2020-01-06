const userId = window.location.pathname.replace('/', '');
const { host } = window.location;

function fetchAndUpdateJoke() {

}

const wsClient = () => {
    const webSocketClient = new WebSocket(`ws://${host}/ws`);

    webSocketClient.onopen = function() {
        console.log(' connected ');
        webSocketClient.send(
            JSON.stringify({
                type: 'INIT',
                payload: userId,
            })
        );
    };

    webSocketClient.onmessage = function(event) {
        const message = JSON.parse(event.data);

        switch (message.type) {
            case 'UPDATE_JOKE':
                fetchAndUpdateJoke();
                break;
            default:
                return;
        }
    };
    return webSocketClient;
};