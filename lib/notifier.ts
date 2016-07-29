import core = require('./core');

export class Notifier {

  constructor() {
    core.logger.info("Notifier constructed.");
  }

  public notify(message:string):void {
    core.logger.info("Notify. msg=#{message}");
  }

}
