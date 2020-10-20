const express = require('express')

let dotenvConfigured = false

function createApp() {
  if (!dotenvConfigured) {
    require('dotenv').config()
    dotenvConfigured = true
  }

  const ex = express()

  // Start initializing
  require('./loaders/express')(ex)

  return ex
}

module.exports = {
  createApp
}
