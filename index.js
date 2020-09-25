// Some old school imports to support Node 12
// in the Github Actions runner
const ngrok = require('ngrok');
const express = require('express');
const chalk = require('chalk');
const log = console.log;

// First, start our web server...
const api = express();

// Handle our routes...
api.get('/', (req, res) => {
    res.send('Hello world!');
});

api.post('/', (req, res) => {
    try {
        const body = JSON.parse(req.body);
        const { code } = body;
        if (code) {
            res.status(204).send();
            process.exit(0);
        }
        else {
            res.status(400).send({'error': 'No code provided.'});
        }
    }
    catch (exc) {
        res.status(500).send(exc);
    }
});

// Start our API server and ngrok.
// Once we do that, we need to start the publishing process
api.listen(9090, async () => {
    const url = await ngrok.connect(9090);
    
    log(chalk.blue( '===> When you receive your two factor auth code, visit:'));
    log(chalk.white(`     ${url}`));
    log('');
});
