"use strict";
var core = require('./core');
var Notifier = (function () {
    function Notifier() {
        core.logger.info("Notifier constructed.");
    }
    Notifier.prototype.notify = function (message) {
        core.logger.info("Notify. msg=#{message}");
    };
    return Notifier;
}());
exports.Notifier = Notifier;
//# sourceMappingURL=notifier.js.map