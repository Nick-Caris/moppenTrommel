require('dotenv').config();
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const fetch = require('node-fetch');

const controller = express.Router();

controller.post('/', async (req, res, next) => {
    try {
        return res.sendStatus(201);
    } catch (error) {
        next(error);
    }
});

controller.get('/:userId', async (req, res, next) => {
    try {

        const {setup, punchLine} = await getJoke();

        console.log('setup: ', setup);


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


        // todo: add html
        res.set('Content-Type', 'text/html');
        return res.send(html);
        //return res.sendStatus(201);
    } catch (error) {
        next(error);
    }
});

controller.get('/:userId/html', async (req, res, next) => {
    try {

        const html = `
        <div>
            <p>Why did the chicken cross the road?</p>
            <p>Cause he fucked your mom.</p>
        </div>
        `;


        // todo: add html
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


module.exports = controller;