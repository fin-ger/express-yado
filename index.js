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
const times = new Map();

app.use('/', express.static('node_modules/yado/build'));

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
        times.set(req.body.name, new Date());

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

const interval = setInterval(() => {
    console.log('Checking for old cards...');

    const rms = []
    times.forEach((time, name) => {
        const current = new Date();

        // remove after 60 minutes
        if ((current - time) > 60 * 60 * 1000) {
            rms.push(name);
        }
    });
    rms.forEach((name) => {
        console.log('Removing card', name);
        cards.delete(name);
        times.delete(name);
        io.emit('card remove', name);
    });
}, 5 * 60 * 1000); // every 5 minutes

server.listen(port, () => {
    console.log('Server listening on port %d', port);
});
