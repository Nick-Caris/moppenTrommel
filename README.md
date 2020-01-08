# Widget demo Joke application

In this readme you will learn how to create a simple widget for your Takahe mirror.
This app takes [the barebone widget](https://github.com/dhelicopters/Barebone-widget) and build upon that.

## app.js

Once you have the structure from the barebone widget you start at app.js.
 To get biometric data from the mirror you need to send a message on open, in this message you say what you want to subscribe to and the ID of your widget.

```javascript
        wsClient.on('open', () => {
            wsClient.send(
                JSON.stringify({
                    action: 'setWidget',
                    widgetId: 'JOKE_WIDGET',
                    sub_emotion: false,
                    sub_face: false,
                    sub_gesture: false,
                    sub_voice: true,
                    sub_gender: false,
                    sub_age: false,
                })
            );
            resolve(wsClient);
        });
```

The next step is to assign actions to biometric data, you do that via websockets.
When you receive a message from the mirror and retrieve all the biodata you subscribed to. you get that data from the message (here we only get voice) `const {userId, voice} = message.bioData;`, and based on that you send out websocket messages.

```javascript
if (sentenceContainsWord(voice, commandWords, false)) {
                const client = clients[userId];

                if (client.socket) {
                    client.socket.send(
                        JSON.stringify({type: 'UPDATED_JOKE'})
                    );
                }
            }
``` 

This piece of code uses two pieces of code from `voiceHelper.js`, the sentenceContainsWord and the commandWords.

## main.js

The next step is to go to `main.js` and capture the websocket message, you can capture each websocket message you send and call a function to do a specific task.
In this example when the websocket message `UPDATE_JOKE` will get a new joke.

```javascript
 webSocketClient.onmessage = async function (event) {
        const message = JSON.parse(event.data);

        switch (message.type) {
            case 'UPDATED_JOKE':
                // For example, you can fetch new stuff to be displayed on your frontend based
                await updateJoke();
                break;
            default:
                return;
        }
    };
```

This catches the message and call's updateJoke.

```javascript
async function updateJoke() {
    // you can use this method to call the widget backend and if everything succeeds
    // load the HTML into the frontend by setting the innerHTML of an element in your HTML template
    const response = await fetch(`http://${host}/${userId}/html`);
    if (response.status === 200) {
        const html = await response.text();
        const container = document.getElementById('container');
        container.innerHTML = html;
    }
    return null;
}
``` 

The updateJoke function then call's a end point we created in the controller.

## index.html

In the `index.html` you will have the base html for your widget, we have added a base card in
the backbone repository. This base card fits with the design of the mirror.

NOTE: the background of the mirror is black so don't use black text.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
    <script defer src="https://use.fontawesome.com/releases/v5.12.0/js/all.js"></script>
    <link rel="stylesheet" href="/style.css"/>
</head>
<body>
<div class="card active-widget">
    <div class="card-content">
        <div class="inner-card-content" id="container">
            {{widgetHTML}}
        </div>
    </div>
</div>
<script src="/main.js" type="text/javascript"></script>
</body>
</html>
```

## controller.js

The controller will have at least one function (you can add more if needed).
This call is `http://www.yourUrl.com/:userId`, and this call will give the data when the widgets is first activated.
Here you will use the `index.html` and add your own code in there.

```javascript
controller.get('/:userId', async (req, res, next) => {
    try {
        // Load the index.html
        const fileBuffer = await new Promise((resolve, reject) => {
            fs.readFile(`./public/index.html`, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });

        const {setup, punchLine} = await getJoke();

        // Create your own HTML
        const widgetHTML = `
        <style> 
        p {
            color: white
        }
        </style>
        
        <div class="container" >
            <p>${setup}</p>
            <p>${punchLine}</p>
        </div>
        `;


        // Add it to the index.html
        const html = fileBuffer
            .toString()
            .replace('{{widgetHTML}}', widgetHTML);

        // Send it to the Takahe Magic Mirror        res.set('Content-Type', 'text/html');
        return res.send(html);
        //return res.sendStatus(201);
    } catch (error) {
        next(error);
    }
});
```

In this example I use another end-point to update the joke screen.

```javascript
controller.get('/:userId/html', async (req, res, next) => {
    try {
        const {setup, punchLine} = await getJoke();

        const html = `
        <style> 
        p {
            color: white
        }
        </style>
        
        <div class="container" >
            <p>${setup}</p>
            <p>${punchLine}</p>
        </div>
        `;

        res.set('Content-Type', 'text/html');
        return res.send(html);
    } catch (error) {
        next(error);
    }
});
```

With this you have build your own small Takahe widget with use of one biodata. You can add more and more functionality and use more/different biodata.