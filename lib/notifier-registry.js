"use strict";
var notifier_1 = require("./notifier");
var pushbullet_notifier_1 = require("./pushbullet-notifier");
var core = require("./core");
var NotifierRegistry = (function () {
    function NotifierRegistry() {
    }
    NotifierRegistry.generate = function () {
        if (core.commander.apikey)
            return new pushbullet_notifier_1.PushbulletNotifier();
        else
            return new notifier_1.Notifier();
    };
    return NotifierRegistry;
}());
exports.NotifierRegistry = NotifierRegistry;
//# sourceMappingURL=notifier-registry.js.map