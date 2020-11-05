const shell = require('shelljs')
const chalk = require('chalk')

function buildImage(name, containerfile) {
  require('dotenv').config()
  console.info(chalk.greenBright(`📦 Packaging OCI image: ${name}`))

  const basename = process.env.CONTAINER_BASENAME
  container(`build -f ${containerfile} -t ${basename}${name} .`)
}

function container(args) {
  const eng = resolveContainerEngine()
  stream(chalk.blue(`[${eng}]`), `${eng} ${args}`)
}

function stream(label, command) {
  const child = shell.exec(command, { async: true, silent: true })
  child.stdout.on('data', (data) => {
    process.stdout.write(`${label} ${data}`)
  })
  child.stderr.on('data', (data) => {
    process.stdout.write(chalk.red(`${label} ${data}`))
  })
}

function resolveContainerEngine() {
  if (shell.which('podman')) {
    return 'podman'
  }
  if (shell.which('docker')) {
    return 'docker'
  }
  throw new Error('Can\'t find a installed container engine. Install podman or docker.')
}

module.exports = buildImage
