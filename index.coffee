path = require 'path'

log4js = require 'log4js'
commander = require 'commander'
chokidar = require 'chokidar'

packageJson = require './package.json'
core = require './lib/core'
Notifier = require './lib/notifier'


log4js.configure path.normalize(__dirname + '/./log4js-config.json'), {cwd: path.normalize(__dirname + '/.')}
core.logger = log4js.getLogger('system')

commander
.version packageJson.version
.usage '[options]'
.option '-d, --directory [value]', 'set the watch directory', String, '.'
.option '-c, --count <n>', 'set number of watch event times to start the notification.', Number, 3
.option '-t, --timelimit <n>', 'set time limit to start the notification.', Number, 30
.option '-m, --message <msg>', 'set message of notification.', String, 'Notified.'
.option '-k, --apikey <key>', 'set the api key of pushbullet', String, ''
.parse process.argv
core.commander = commander

notifier = Notifier::s_generate()

lastTime = Date.now()
lastCount = 0

chokidar.watch commander.directory,
  ignoreInitial: true
.on 'add', (path) ->
  if lastCount is 0
    lastTime = Date.now()
  lastCount++
  restMsec = commander.timelimit * 1000 - Date.now() + lastTime
  core.logger.debug "Alert #{lastCount} / #{commander.count} count, rest #{Math.floor(restMsec / 1000)} sec"
  if restMsec < 0
    lastCount = 0
  else if lastCount >= commander.count
    notifier.notify "#{commander.message}"
    lastCount = 0
