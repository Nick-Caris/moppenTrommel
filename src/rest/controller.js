require('dotenv').config();
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const fetch = require('node-fetch');

const controller = express.Router();

// Required endpoint so the widget is registered on the Takahe Magic Mirror
controller.post('/', async (req, res, next) => {
    try {
        const {clients} = req;
        const {userId} = req.body;

        if (userId) {
            if (!clients[userId]) {
                clients[userId] = {};
                return res.sendStatus(201);
            }
            return res.sendStatus(201);
        }
        return res.sendStatus(400);
    } catch (error) {
        next(error);
    }
});

// Required endpoint that is used by the Takahe Magic Mirror to get the HTML that has is going to be displayed
// on the mirror. The mirror uses sandboxed i-frames to display the widget, so you are free to return what ever content you like, as long as its HTML.
// The i-frame has a height of 20vh and a width of 100vw.
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

// Below you can add your own endpoints that your widget uses to get data to display.
controller.get('/:userId/html', async (req, res, next) => {
    try {
        const {setup, punchLine} = await getJoke();

        const html = `     
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

controller.get('/:userId/giphy', async (req, res, next) => {
    try {
        gif = await getGif();

        const html = `
        <div class="container" >
          <img src="${gif}">
        </div>
        `;

        res.set('Content-Type', 'text/html');
        return res.send(html);
    } catch (error) {
        next(error);
    }
});


async function getJoke() {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');

    const json = await response.json();

    console.log('json: ', json);

    const setup = json.setup;
    const punchLine = json.punchline;

    return {setup: setup, punchLine: punchLine};
}

async function getGif() {
    const {GIFY_KEY} = process.env;
    console.log('key: ', GIFY_KEY);

    const response = await fetch(`http://api.giphy.com/v1/gifs/random?key=${GIFY_KEY}&limit=1`);

    const json = await response.json();

    return json.data.image_url;
}


module.exports = controller;