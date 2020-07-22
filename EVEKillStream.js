const WebSocket = require('ws');
const yaml = require('js-yaml');
const fs   = require('fs');

const ws = new WebSocket('wss://zkillboard.com:2096')

try {
    typeIDs = yaml.load(fs.readFileSync('./EveStaticData/typeIDs.yaml', 'utf8'));
} catch (e) {
    console.log(e);
}

ws.on('open', function open() {
    ws.send('{"action":"sub","channel":"all:*"}');
});

ws.on('message', function incoming(data) {
    //console.log(JSON.parse(data));
    var recv = JSON.parse(data);
    var ship = recv["ship_type_id"];
    console.log(recv);
    console.log(ship);
    }
);
