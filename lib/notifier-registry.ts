import {Notifier} from "./notifier";
import {PushbulletNotifier} from "./pushbullet-notifier";
import core = require("./core");

export class NotifierRegistry {

  public static generate():Notifier {
    if (core.commander.apikey)
      return new PushbulletNotifier();
    else
      return new Notifier();
  }

}
