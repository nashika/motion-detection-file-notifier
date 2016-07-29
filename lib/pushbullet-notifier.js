"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Pushbullet = require("pushbullet");
var core = require("./core");
var notifier_1 = require("./notifier");
var PushbulletNotifier = (function (_super) {
    __extends(PushbulletNotifier, _super);
    function PushbulletNotifier() {
        _super.call(this);
        if (core.commander.apikey) {
            this._pushbullet = new Pushbullet(core.commander.apikey);
            this._pushbullet.me(function (err, response) {
                if (err) {
                    core.logger.fatal("Pushbullet auth failed.");
                    process.exit(1);
                }
                else {
                    core.logger.info("Pushbullet auth succeed. response=" + JSON.stringify(response));
                }
            });
        }
        else {
            core.logger.fatal("Pushbullet notifier need --apikey option.");
            process.exit(1);
        }
    }
    PushbulletNotifier.prototype.notify = function (message) {
        _super.prototype.notify.call(this, message);
        this._pushbullet.note(null, message, message, function (err) {
        });
    };
    return PushbulletNotifier;
}(notifier_1.Notifier));
exports.PushbulletNotifier = PushbulletNotifier;
//# sourceMappingURL=pushbullet-notifier.js.map