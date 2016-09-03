const assert = require('assert');
const app = require('../server');
const request = require('request');
const fixtures = require('./fixtures');

describe('Server', () => {

  before(done => {
    this.port = 9876

    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    });
  });

  after(done => {
    this.server.close()
    done();
  });

  it('should exist', () => {
    assert(app);
  });

  describe('GET /', () => {

    it('should return a 200', (done) => {
      this.request.get('/', (error, response) => {
        if(error) { done(error); }
        assert.equal(response.statusCode, 200)
        done();
      })
    });

    it('should have a body with the name of application', (done) => {
      var title = app.locals.title;

      this.request.get('/', (error, response) => {
        if(error) { done(error); }
        assert(response.body.includes(title),
               `"${response.body}" does not include "${title}".`);
               done();
      })
    });
  });

  describe('POST /pizzas', () => {

    beforeEach(() => {
      app.locals.pizzas = {}
    });

    it('should not return 404', (done) => {
      this.request.post('/pizzas', (error, response) => {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    it('should recieve and store date', (done) => {
      var payload = { pizza: fixtures.validPizza }

      this.request.post('/pizzas', { form: payload }, (error, response) => {
        if(error) { done(error); }

        var pizzaCount = Object.keys(app.locals.pizzas).length;

        assert.equal(pizzaCount, 1, `Expected 1 pizzas, found "${pizzaCount}}`);
        done();
      });
    })
  });

  describe('POST /pizzas/:id', () => {
    beforeEach(() => {
      app.locals.pizzas.testPizza = fixtures.validPizza;
    });

    it('should not return a 404', (done) => {
      this.request.get('/pizzas/testPizza', (err, res) => {
        if (err) { done(err); }
        assert.notEqual(res.statusCode, 404);
        done();
      });
    });

    it('should return a page that has a title of a pizza', (done) => {
      var pizza = app.locals.pizzas.testPizza;

      this.request.get('/pizzas/testPizza', (err, res) => {
        if(err) { done(err); }
        assert(res.body.includes(pizza.name), `"${res.body}" does not include "${pizza.name}".`);
        done();
      })
    });

    it('should return a list of toppings', (done) => {
      var pizza = app.locals.pizzas.testPizza = fixtures.validPizza
      var pizzaToppings = pizza.toppings

      this.request.get('/pizzas/testPizza', (err, res) => {
        if (err) { done(err); }
        pizzaToppings.forEach(function(topping) {
          assert(res.body.includes(topping), `"${topping}" is not included.`);
        });
        done();
      });
    });
  });
});
