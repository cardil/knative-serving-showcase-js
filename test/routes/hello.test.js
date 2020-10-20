const request = require('supertest')

describe('Route', () => {
  const app = require('../../src/app').createApp()
  it('GET /hello?who=James', (done) => {
    request(app)
      .get('/hello')
      .query({ who: 'James' })
      .expect('Content-Type', /application\/json/)
      .expect(200, {
        who: 'James',
        number: 1,
        greeting: 'Hello'
      }, done)
  })

})
