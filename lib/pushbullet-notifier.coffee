Pushbullet = require 'pushbullet'

core = require './core'
Notifier = require './notifier'

class PushbulletNotifier extends Notifier

  ###*
  # @protected
  # @type Pushbullet
  ###
  _pushbullet: null

  ###*
  # @override
  ###
  constructor: ->
    super()
    if core.commander.apikey
      @_pushbullet = new Pushbullet(core.commander.apikey)
      @_pushbullet.me (err, response) =>
        if err
          core.logger.fatal 'Pushbullet auth failed.'
          process.exit 1
        else
          core.logger.info "Pushbullet auth succeed. response=#{JSON.stringify(response)}"
    else
      core.logger.fatal 'Pushbullet notifier need --apikey option.'
      process.exit 1

  ###*
  # @override
  ###
  notify: (message) =>
    super message
    @_pushbullet.note null, message, message, (err) =>


module.exports = PushbulletNotifier
