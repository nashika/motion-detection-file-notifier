"use strict";
var path = require("path");
var log4js = require("log4js");
var commander = require("commander");
var chokidar = require("chokidar");
var packageJson = require("./package.json");
var core = require("./lib/core");
var notifier_registry_1 = require("./lib/notifier-registry");
log4js.configure(path.normalize(__dirname + "/./log4js-config.json"), { cwd: path.normalize(__dirname + "/.") });
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
var options = commander.opts();
if (!options.directory) {
    commander.help();
}
var notifier = notifier_registry_1.NotifierRegistry.generate();
var startTime = Date.now();
var lastTime = 0;
var count = 0;
chokidar.watch(options.directory, {
    ignoreInitial: true,
}).on('add', function (path) {
    var intervalRestMsec;
    if ((intervalRestMsec = options.interval * 1000 - (Date.now() - lastTime)) > 0) {
        core.logger.debug("Alert interval. rest " + Math.floor(intervalRestMsec / 1000) + " sec");
        return;
    }
    if (count == 0) {
        startTime = Date.now();
    }
    count++;
    var restMsec = options.limit * 1000 - (Date.now() - startTime);
    core.logger.debug("Alert " + count + " / " + options.count + " count, rest " + Math.floor(restMsec / 1000) + " sec");
    if (restMsec < 0) {
        count = 0;
    }
    else if (count >= options.count) {
        notifier.notify("" + options.message);
        lastTime = Date.now();
        count = 0;
    }
});
//# sourceMappingURL=index.js.map