const { Greeter } = require('../services/hello')
const { sink } = require('../services/config')

module.exports = (app) => {

  app.get('/hello', async (req, res) => {

    const greeter = new Greeter(sink)
    const who = req.query.who || 'Person'
    const hello = await greeter.hello({ who })

    res.json(hello)
  })

}
