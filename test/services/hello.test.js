const nock = require('nock')
const freePort = require('get-port')
const { HTTP } = require('cloudevents')

const { Greeter } = require('../../src/services/hello')
const mockUrl = (port) => `http://localhost:${port}/`

let counter = 0
const people = ['Alice', 'Bob', 'Charlie', 'Doug', 'Emilie', 'Greg']

describe('Greeter', () => {
  it('hello', async () => {
    const port = await freePort()
    const url = mockUrl(port)
    const who = people[Math.ceil(Math.random() * people.length)]
    let receivedEvent = {}
  
    nock(url)
      .post('/')
      .once()
      .reply(function (_uri, body) {
        counter++
  
        const req = this.req // eslint-disable-line no-invalid-this
        receivedEvent = HTTP.toEvent({
          headers: req.headers,
          body
        })
  
        return [201, 'OK']
      })
  
    const g = new Greeter(() => url)
    const hello = await g.hello({ who })
  
    expect(hello.who).toEqual(who)
    expect(counter).toEqual(1)
    const data = JSON.parse(receivedEvent.data)
    expect(data.who).toEqual(who)
  })
})
