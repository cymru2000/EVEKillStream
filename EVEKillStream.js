//Things we need
const WebSocket = require('ws');
const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config.js");

const app = express()

//Connect to cosmosdb
const { endpoint, key, databaseId, containerId } = config;
const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

//Define the websocket connection
const ws = new WebSocket('wss://zkillboard.com:2096')

//Define the dev HTTP server settings
const host = 'localhost';
const port = 8000;

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
  }))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

//Define all the variables as 0 or blank
var killcounter = 0;
var totalValue = 0;
var value = 0;
var runningValue = 0;
var km_time = "";
var solar_system = "";
var victim = "";
var rawship_type = "0";
var ship_type = "";
  
app.listen(port, (err) => {
    if (err) {
      return console.log('something bad happened', err)
    }
      console.log(`server is listening on ${port}`)
})

//Open the websocket and send the request for data
ws.on('open', function open() {
    ws.send('{"action":"sub","channel":"killstream"}');
});

//Do something with the messages as they stream
ws.on('message', function incoming(data) {

    killcounter ++;

    //console.log(JSON.parse(data));
    var recv = JSON.parse(data);
    km_time = recv["killmail_time"];
    solar_system = recv["solar_system_id"];
    victim = recv["victim"];
    rawship_type = victim["ship_type_id"];
    
    
    const queryspec = { query: "select i.typeName from invTypes i where i.typeID = ",rawship_type};
    const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
    ship_type = '$typeName'
                                   
    zkb = recv["zkb"];
    value = zkb["totalValue"];
    runningValue = (value + runningValue)
    totalValue = (runningValue/1000000000).toFixed(2);

    //console.log(recv);
    console.log("==========");
    console.log("Killcount:",killcounter);
    console.log("totalValue:",totalValue);
    console.log("Kill Time:",km_time);
    console.log("ShipType:",ship_type);
    console.log("System:",solar_system);
    console.log("Value:",value);
    console.log("==========");
    console.log("");
    app.get('/', (request, response) => {
        response.render('home', {
          killcounter: killcounter,
          km_time: km_time,
          ship_type: ship_type, 
          solar_system: solar_system,
          totalValue: totalValue,
          value: (value/1000000).toFixed(2)
        })
      })
});
