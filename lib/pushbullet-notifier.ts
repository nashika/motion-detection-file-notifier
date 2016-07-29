let Pushbullet:any = require("pushbullet");
import core = require("./core");
import {Notifier} from "./notifier";

export class PushbulletNotifier extends Notifier {

  protected _pushbullet:any;

  constructor() {
    super();
    if (core.commander.apikey) {
      this._pushbullet = new Pushbullet(core.commander.apikey);
      this._pushbullet.me((err:any, response:any) => {
        if (err) {
          core.logger.fatal("Pushbullet auth failed.");
          process.exit(1);
        }
        else {
          core.logger.info(`Pushbullet auth succeed. response=${JSON.stringify(response)}`);
        }
      });
    } else {
      core.logger.fatal(`Pushbullet notifier need --apikey option.`);
      process.exit(1);
    }
  }

  public notify(message:string):void {
    super.notify(message);
    this._pushbullet.note(null, message, message, (err:any) => {
    });
  }

}
