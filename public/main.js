// This is the Javascript that supports the frontend of the widget.
// You can basically do anything you like, but keep in mind it's loaded in
// a sandboxed i-frame.
const userId = window.location.pathname.replace('/', '');
const {host} = window.location;

async function updateScreen() {
    // you can use this method to call the widget backend and if everything succeeds
    // load the HTML into the frontend by setting the innerHTML of an element in your HTML template
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

    webSocketClient.onmessage = function (event) {
        const message = JSON.parse(event.data);

        switch (message.type) {
            case 'UPDATE_SOMETHING':
                // For example, you can fetch new stuff to be displayed on your frontend based
                updateScreen();
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