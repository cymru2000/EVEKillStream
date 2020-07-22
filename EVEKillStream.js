const WebSocket = require('ws');

const ws = new WebSocket('wss://zkillboard.com:2096')

ws.on('open', function open() {
    ws.send('{"action":"sub","channel":"all:*"}');
});

ws.on('message', function incoming(data) {
    console.log(data);
});