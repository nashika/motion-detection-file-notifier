core = require './core'

class Notifier

  ###*
  # @constructor
  ###
  constructor: ->
    core.logger.info 'Notifier constructed.'

  ###*
  # @public
  # @param {string} message
  ###
  notify: (message) =>
    core.logger.info "Notify. msg=#{message}"

  ###*
  # @public
  # @static
  # @return {Notifier}
  ###
  s_generate: =>
    if core.commander.apikey
      PushbulletNotifier = require './pushbullet-notifier'
      return new PushbulletNotifier()
    else
      return new Notifier()

module.exports = Notifier
