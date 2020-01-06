require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const Ws = require('ws');

const cors = require('cors');
const jokeController = require('./rest/controller');

const httpServer = http.createServer();
const app = express();
const {WEBSOCKET_SERVER_ADDRESS, HTTP_PORT} = process.env;

httpServer.on('request', app);
const clients = {};

app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

app.use(express.static('../public'));

app.use((req, res, next) => {
    req.clients = clients;
    next();
});

app.use('/', jokeController);

app.use((err, req, res) => {
    console.error(`err: ${err}`);
    res.status(500).send('Server Error');
});

const wsServer = new Ws.Server({
    path: '/ws',
    noServer: true,
});

wsServer.on('connection', socket => {
    socket.on('message', rawMessage => {
        const message = JSON.parse(rawMessage);
        let userId;

        switch (message.type) {
            case 'INIT':
                userId = message.payload;
                if (clients && clients[userId]) {
                    clients[userId].socket = socket;
                    socket.userId = userId;
                } else {
                    socket.close();
                }
                break;
            default:
                return;
        }
    });
});

const setupConnection = () => {
    return new Promise((resolve, reject) => {
        const wsClient = new Ws(WEBSOCKET_SERVER_ADDRESS);

        wsClient.on('open', () => {
            wsClient.send(
                JSON.stringify({
                    action: 'setWidget',
                    widgetId: 'moppenTrommel',
                    sub_emotion: false,
                    sub_face: false,
                    sub_gesture: false,
                    sub_voice: true,
                })
            );
            resolve(wsClient);
        });

        wsClient.on('message', (event) => {
            const voiceMessage = JSON.parse(event);

            const {userId, voice} = voiceMessage.bioData;


        });

        wsClient.on('close', event => {
            reject(event);
        });
        wsClient.on('error', event => {
            reject(event);
        });
    });
};

httpServer.on('upgrade', (req, networkSocket, head) => {
    wsServer.handleUpgrade(req, networkSocket, head, newWebSocket =>
        wsServer.emit('connection', newWebSocket, req)
    );
});

httpServer.listen(HTTP_PORT, async () => {
    await setupConnection();
    console.log(`http server listening on port: ${HTTP_PORT}`);
});