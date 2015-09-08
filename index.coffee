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
.option '-l, --limit <n>', 'set limit second to start the notification.', Number, 30
.option '-i, --interval <n>', 'set interval second to start next notification.', Number, 60
.option '-m, --message <msg>', 'set message of notification.', String, 'Notified.'
.option '-k, --apikey <key>', 'set the api key of pushbullet', String, ''
.parse process.argv
core.commander = commander

notifier = Notifier::s_generate()

startTime = Date.now()
lastTime = 0
count = 0

chokidar.watch commander.directory,
  ignoreInitial: true
.on 'add', (path) ->
  if (intervalRestMsec = commander.interval * 1000 - (Date.now() - lastTime)) > 0
    core.logger.debug "Alert interval. rest #{Math.floor(intervalRestMsec / 1000)} sec"
    return
  if count is 0
    startTime = Date.now()
  count++
  restMsec = commander.limit * 1000 - (Date.now() - startTime)
  core.logger.debug "Alert #{count} / #{commander.count} count, rest #{Math.floor(restMsec / 1000)} sec"
  if restMsec < 0
    count = 0
  else if count >= commander.count
    notifier.notify "#{commander.message}"
    lastTime = Date.now()
    count = 0
