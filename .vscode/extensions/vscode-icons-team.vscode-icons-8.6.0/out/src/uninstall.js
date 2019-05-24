"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configManager_1 = require("./configuration/configManager");
function uninstall() {
    return configManager_1.ConfigManager.removeSettings();
}
uninstall();
