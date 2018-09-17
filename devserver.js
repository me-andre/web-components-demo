const express = require('express');
const app = express();

app.use(express.json());

app.get('/sample-data.json', (req, res) => {
    res.sendFile(`${__dirname}/sample-data.json`);
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get('/list.js', (req, res) => {
    res.sendFile(`${__dirname}/list.js`);
});

app.listen(3000);