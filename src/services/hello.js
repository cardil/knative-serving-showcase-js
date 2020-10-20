const request = require('superagent')
const { HTTP, CONSTANTS, CloudEvent } = require('cloudevents')
const { Hello } = require('../domain/entity/hello')

const type = 'io.github.cardil.knsvng.domain.entity.Hello'
const source = '//events/serving-showcase'

let number = 0

class Greeter {
  constructor(sink) {
    this.sink = sink
  }

  async hello({ who }) {
    const hello = new Hello('Hello', who, ++number)
    const url = this.sink()
    const data = JSON.stringify(hello)
    const ce = new CloudEvent({
      type, source, data,
      datacontenttype: CONSTANTS.DEFAULT_CONTENT_TYPE
    })
    const message = HTTP.structured(ce)

    const req = request.post(url)
    Object.keys(message.headers).forEach((key) => {
      req.set(key, message.headers[key])
    })
    try {
      await req.send(message.body)
      console.log(`Event ${ce.id} sent to ${url}`)
    } catch (err) {
      console.error(`Couldn't send an event ${ce.id} to ${url}`, err)
    }
    
    return hello
  }
}

module.exports = {
  Greeter
}
