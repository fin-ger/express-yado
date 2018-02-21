const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8002;
const ticket = process.env.TICKET || 'YnbHT57VAc7HHCmY16mo1DyHUNdbpG1p';

const types = [
    'door',
    'text',
];

const doorData = [
    'open',
    'closed',
];

const cards = new Map();

app.use(bodyParser.json());
app.post('/api/', (req, res) => {
    if (!req.body.ticket ||
        req.body.ticket !== ticket) {
        res.json({
            status: 'unauthorized',
        });
        return;
    }

    if (!req.body.name ||
        !req.body.type ||
        types.indexOf(req.body.type) < 0 ||
        !req.body.description ||
        !req.body.data ||
        (req.body.type === 'door' && doorData.indexOf(req.body.data) < 0)) {
        res.json({
            status: 'invalid-content',
        });
    } else {
        console.log('Emitting card change for card', req.body.name);
        const card = {
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            data: req.body.data,
        };
        cards.set(req.body.name, card);

        io.emit('card change', card);
        res.json({
            status: 'success',
        });
    }
});
io.on('connection', (s) => {
    cards.forEach(card => {
        s.emit('card change', card);
    });
});

server.listen(port, () => {
    console.log('Server listening on port %d', port);
});
