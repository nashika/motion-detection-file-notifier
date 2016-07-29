import path = require("path");

import log4js = require("log4js");
import commander = require("commander");
import chokidar = require("chokidar");

let packageJson:any = require("./package.json");
import core = require("./lib/core");
import {NotifierRegistry} from "./lib/notifier-registry";
import {Notifier} from "./lib/notifier";

log4js.configure(path.normalize(__dirname + "/./log4js-config.json"), {cwd: path.normalize(__dirname + "/.")});
core.logger = log4js.getLogger("system");

commander.version(packageJson.version)
  .usage("[options]")
  .option("-d, --directory [value]", "set the watch directory", String, ".")
  .option("-c, --count <n>", "set number of watch event times to start the notification.", Number, 3)
  .option("-l, --limit <n>", "set limit second to start the notification.", Number, 30)
  .option("-i, --interval <n>", "set interval second to start next notification.", Number, 60)
  .option("-m, --message <msg>", "set message of notification.", String, "Notified.")
  .option("-k, --apikey <key>", "set the api key of pushbullet", String, "")
  .parse(process.argv);
core.commander = commander;

let notifier:Notifier = NotifierRegistry.generate();

let startTime:number = Date.now();
let lastTime:number = 0;
let count:number = 0;

chokidar.watch((<any>commander).directory, {
  ignoreInitial: true,
}).on('add', (path:string) => {
  let intervalRestMsec:number;
  if ((intervalRestMsec = (<any>commander).interval * 1000 - (Date.now() - lastTime)) > 0) {
    core.logger.debug(`Alert interval. rest ${Math.floor(intervalRestMsec / 1000)} sec`);
    return;
  }
  if (count == 0) {
    startTime = Date.now();
  }
  count++;
  let restMsec:number = (<any>commander).limit * 1000 - (Date.now() - startTime);
  core.logger.debug(`Alert ${count} / ${(<any>commander).count} count, rest ${Math.floor(restMsec / 1000)} sec`);
  if (restMsec < 0) {
    count = 0;
  } else if (count >= (<any>commander).count) {
    notifier.notify(`${(<any>commander).message}`);
    lastTime = Date.now();
    count = 0;
  }
});
