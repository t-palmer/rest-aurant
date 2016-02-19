var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var restaurants = require('./restaurants.js');

var app = express();
var logger= morgan('dev'); /* 'default', 'short', 'tiny', 'dev' */

app.use(logger);     
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get('/', function(request, response) {
  response.send('RESTaurant is a Node.js example of a simple REST API for the MongoDB restaurant sample dataset.')
})
app.get('/restaurants', restaurants.findAll);
// names must appear before the ID get otherwise it treats name as the query param
app.get('/restaurants/names', restaurants.listNames);
app.get('/restaurants/:id', restaurants.findById);
app.post('/restaurants', restaurants.addRestaurant);
app.put('/restaurants/:id', restaurants.updateRestaurant);
app.delete('/restaurants/:id', restaurants.deleteRestaurant);


var portNumber= 3000;
if (process.argv[2]){
  portNumber= Number(process.argv[2]);
}
app.listen(portNumber);
console.log('RESTaurants API listening on port '+portNumber);