"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const models_1 = require("./models");
const compositionRootService_1 = require("./services/compositionRootService");
function activate(context) {
    const crs = new compositionRootService_1.CompositionRootService(context);
    const extension = crs.get(models_1.SYMBOLS.IExtensionManager);
    extension.activate();
    // tslint:disable-next-line no-console
    console.info(`[${constants_1.constants.extension.name}] v${constants_1.constants.extension.version} activated!`);
}
exports.activate = activate;
// this method is called when your vscode is closed
function deactivate() {
    // no code here at the moment
}
exports.deactivate = deactivate;
