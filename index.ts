import path = require("path");

import log4js = require("log4js");
import commander = require("commander");
import chokidar = require("chokidar");

let packageJson:any = require("./package.json");
import core = require("./lib/core");
import {NotifierRegistry} from "./lib/notifier-registry";
import {Notifier} from "./lib/notifier";

interface ICommandOptions {
  directory:string;
  count:number;
  limit:number;
  interval:number;
  message:string;
  apiKey:string;
}

log4js.configure(path.normalize(__dirname + "/./log4js-config.json"), {cwd: path.normalize(__dirname + "/.")});
core.logger = log4js.getLogger("system");

commander
  .version(packageJson.version)
  .usage("[options]")
  .option("-d, --directory [value]", "set the watch directory. (Required)", String, "")
  .option("-c, --count <n>", "set number of watch event times to start the notification. (Optional)", Number, 3)
  .option("-l, --limit <n>", "set limit second to start the notification. (Optional)", Number, 30)
  .option("-i, --interval <n>", "set interval second to start next notification. (Optional)", Number, 60)
  .option("-m, --message <msg>", "set message of notification. (Optional)", String, "Notified.")
  .option("-k, --apikey <key>", "set the api key of pushbullet (Optional)", String, "")
  .parse(process.argv);
core.commander = commander;

let options:ICommandOptions = commander.opts();

if (!options.directory) {
  commander.help();
}

let notifier:Notifier = NotifierRegistry.generate();

let startTime:number = Date.now();
let lastTime:number = 0;
let count:number = 0;

chokidar.watch(options.directory, {
  ignoreInitial: true,
}).on('add', (path:string) => {
  let intervalRestMsec:number;
  if ((intervalRestMsec = options.interval * 1000 - (Date.now() - lastTime)) > 0) {
    core.logger.debug(`Alert interval. rest ${Math.floor(intervalRestMsec / 1000)} sec`);
    return;
  }
  if (count == 0) {
    startTime = Date.now();
  }
  count++;
  let restMsec:number = options.limit * 1000 - (Date.now() - startTime);
  core.logger.debug(`Alert ${count} / ${options.count} count, rest ${Math.floor(restMsec / 1000)} sec`);
  if (restMsec < 0) {
    count = 0;
  } else if (count >=options.count) {
    notifier.notify(`${options.message}`);
    lastTime = Date.now();
    count = 0;
  }
});
