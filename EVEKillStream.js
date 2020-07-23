//Things we need
const WebSocket = require('ws');
const yaml = require('js-yaml');
const fs   = require('fs');

//Define the websocket connection
const ws = new WebSocket('wss://zkillboard.com:2096')

//Define the killcount variable (may or may not be useful in the future)
var killcounter = 0;

//Load the YAML. This is where the ship names to ID's live. Probably a better idea to turn this into a database table and query that. It's unused in this code anyway!
try {
    typeIDs = yaml.load(fs.readFileSync('./EveStaticData/typeIDs.yaml', 'utf8'));
} catch (e) {
    console.log(e);
}

//Open the websocket and send the request for data
ws.on('open', function open() {
    ws.send('{"action":"sub","channel":"killstream"}');
});

//Do something with the messages as they stream
ws.on('message', function incoming(data) {

    killcounter ++;

    //console.log(JSON.parse(data));
    var recv = JSON.parse(data);
    var km_time = recv["killmail_time"];
    var solar_system = recv["solar_system_id"];
    var victim = recv["victim"];
    var ship_type = victim["ship_type_id"];

    //console.log(recv);
    console.log("==========");
    console.log("Killcount:",killcounter);
    console.log("Kill Time:",km_time);
    console.log("ShipType:",ship_type);
    console.log("System:",solar_system);
    console.log("==========");
    console.log("");

    }
);
