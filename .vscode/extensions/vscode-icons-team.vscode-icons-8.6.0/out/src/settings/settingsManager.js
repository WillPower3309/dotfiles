"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const semver_1 = require("semver");
const models_1 = require("../models");
const utils_1 = require("../utils");
const errorHandler_1 = require("../errorHandler");
const constants_1 = require("../constants");
class SettingsManager {
    constructor(vscodeManager) {
        this.vscodeManager = vscodeManager;
        if (!vscodeManager) {
            throw new ReferenceError(`'vscodeManager' not set to an instance`);
        }
    }
    get isNewVersion() {
        return semver_1.lt(this.getState().version, constants_1.constants.extension.version);
    }
    getState() {
        const state = this.vscodeManager.context.globalState.get(constants_1.constants.vsicons.name);
        return state || SettingsManager.defaultState;
    }
    setState(state) {
        return this.vscodeManager.context.globalState
            .update(constants_1.constants.vsicons.name, state)
            .then(() => {
            return void 0;
        }, reason => {
            return errorHandler_1.ErrorHandler.logError(reason);
        });
    }
    updateStatus(status) {
        const state = this.getState();
        state.version = constants_1.constants.extension.version;
        state.status = status == null ? state.status : status;
        state.welcomeShown = true;
        this.setState(state);
        return state;
    }
    deleteState() {
        return this.vscodeManager.context.globalState
            .update(constants_1.constants.vsicons.name, undefined)
            .then(void 0, reason => errorHandler_1.ErrorHandler.logError(reason));
    }
    moveStateFromLegacyPlace() {
        // read state from legacy place
        const state = this.getStateLegacy();
        // state not found in legacy place
        if (semver_1.eq(state.version, SettingsManager.defaultState.version)) {
            return Promise.resolve();
        }
        // store in new place: 'globalState'
        return this.setState(state).then(() => 
        // delete state from legacy place
        this.deleteStateLegacy());
    }
    /** Obsolete */
    getStateLegacy() {
        const extensionSettingsLegacyFilePath = utils_1.Utils.pathUnixJoin(this.vscodeManager.getAppUserDirPath(), constants_1.constants.extension.settingsFilename);
        if (!fs_1.existsSync(extensionSettingsLegacyFilePath)) {
            return SettingsManager.defaultState;
        }
        try {
            const state = fs_1.readFileSync(extensionSettingsLegacyFilePath, 'utf8');
            return utils_1.Utils.parseJSON(state) || SettingsManager.defaultState;
        }
        catch (error) {
            errorHandler_1.ErrorHandler.logError(error, true);
            return SettingsManager.defaultState;
        }
    }
    /** Obsolete */
    deleteStateLegacy() {
        const extensionSettingsLegacyFilePath = utils_1.Utils.pathUnixJoin(this.vscodeManager.getAppUserDirPath(), constants_1.constants.extension.settingsFilename);
        try {
            fs_1.unlinkSync(extensionSettingsLegacyFilePath);
        }
        catch (error) {
            errorHandler_1.ErrorHandler.logError(error);
        }
    }
}
SettingsManager.defaultState = {
    version: '0.0.0',
    status: models_1.ExtensionStatus.deactivated,
    welcomeShown: false,
};
exports.SettingsManager = SettingsManager;
