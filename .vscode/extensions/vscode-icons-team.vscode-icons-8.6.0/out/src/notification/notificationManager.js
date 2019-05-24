"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class NotificationManager {
    constructor(vscodeManager, i18nManager) {
        this.vscodeManager = vscodeManager;
        this.i18nManager = i18nManager;
    }
    notifyInfo(message, ...items) {
        let msg;
        if (typeof message === 'string' && /%s/.test(message)) {
            const matchesLength = message.match(/%s/g).length;
            const sItems = items.splice(0, matchesLength);
            const msgs = sItems.map(sItem => this.i18nManager.getMessage(sItem));
            msg = util_1.format(message, ...msgs);
        }
        else {
            msg = this.i18nManager.getMessage(message);
        }
        const msgItems = items.map(item => this.i18nManager.getMessage(item));
        return this.vscodeManager.window
            .showInformationMessage(msg, ...msgItems)
            .then(result => this.i18nManager.getLangResourceKey(result) || result);
    }
}
exports.NotificationManager = NotificationManager;
