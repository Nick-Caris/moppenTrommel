require('dotenv').config();
const express = require('express');
const fs = require('fs');
const cors = require('cors');

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
        // todo: add html
        return res.sendStatus(201);
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

module.exports = controller;