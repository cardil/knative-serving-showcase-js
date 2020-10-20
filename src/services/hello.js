const axios = require('axios').default
const { HTTP, CONSTANTS, CloudEvent } = require('cloudevents')
const { Hello } = require('../domain/entity/hello')

const type = 'io.github.cardil.knsvng.domain.entity.Hello'
const source = '//events/serving-showcase'

let number = 0

class Greeter {
  constructor(sink, greeting) {

    /**
     * @type {() => string}
     */
    this.sink = sink

    /**
     * @type {() => string}
     */
    this.greeting = greeting
  }

  /**
   * @param {string} who
   * @returns {Hello}
   */
  async hello({ who }) {
    const hello = new Hello({
      greeting: this.greeting(),
      who,
      number: ++number
    })
    const url = this.sink()
    const data = JSON.stringify(hello)
    const ce = new CloudEvent({
      type, source, data,
      datacontenttype: CONSTANTS.DEFAULT_CONTENT_TYPE
    })
    const message = HTTP.structured(ce)

    try {
      await axios({
        method: 'post',
        url,
        data: message.body,
        headers: message.headers
      })
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
