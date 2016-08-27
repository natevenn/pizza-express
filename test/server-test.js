const assert = require('assert')
const app = require('../server')

describe('Server', () => {

  before(done => {
    this.port = 9876
    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err); }
    });
    done();
  });

  after(done => {
    this.server.close()
    done();
  });

  it('should exist', () => {
     assert(app);
  });
});
