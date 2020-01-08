// This is the Javascript that supports the frontend of the widget.
// You can basically do anything you like, but keep in mind it's loaded in
// a sandboxed i-frame.
const userId = window.location.pathname.replace('/', '');
const {host} = window.location;

async function updateJoke() {
    // you can use this method to call the widget backend and if everything succeeds
    // load the HTML into the frontend by setting the innerHTML of an element in your HTML template
    const response = await fetch(`http://${host}/${userId}/html`);
    if (response.status === 200) {
        const html = await response.text();
        const container = document.getElementById('weather-container');
        container.innerHTML = html;
    }
    return null;
}

// You can use a websocket client to fetch new info when you like
const wsClient = () => {
    const webSocketClient = new WebSocket(`ws://${host}/ws`);

    webSocketClient.onopen = function () {
        webSocketClient.send(
            JSON.stringify({
                type: 'INIT',
                payload: userId,
            })
        );
    };

    webSocketClient.onmessage = async function (event) {
        const message = JSON.parse(event.data);

        switch (message.type) {
            case 'UPDATE_JOKE':
                // For example, you can fetch new stuff to be displayed on your frontend based
                await updateJoke();
                break;
            default:
                return;
        }
    };
    return webSocketClient;
};

(async () => {
    wsClient();
})();