const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const generateID = require('./lib/generate-id')

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.locals.title = 'Pizza Express'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('static'));
app.locals.pizzas = {}

app.get('/', (request, response) => {
  response.render('index');
});

app.get('/pizzas/:id', (request, response) => {
  var pizza = app.locals.pizzas[request.params.id]
  response.render('pizza', { pizza: pizza });
});

app.post('/pizzas', (request, response) => {
  id = generateID();

  app.locals.pizzas[id] = request.body

  response.sendStatus(201);
});

if(!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = app;


