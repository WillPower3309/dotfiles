"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const path_1 = require("path");
const fs_1 = require("fs");
const models_1 = require("../models");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const errorHandler_1 = require("../errorHandler");
class ConfigManager {
    constructor(vscodeManager) {
        this.vscodeManager = vscodeManager;
        // Acts as a static reference to configuration
        // Should only be used when you want to access the configuration functions
        // DO NOT use it to access the `vsicons` configuration,
        // use the `vsicons` function instead
        this.configuration = this.vscodeManager.workspace.getConfiguration();
        this.initVSIconsConfig = this.vsicons;
    }
    /**
     * Returns a `user` and `workspace` merged `vsicons` configuration
     *
     * **Note:** When you want to access `vsicons` configuration always
     * call this function
     */
    get vsicons() {
        // ALWAYS use 'getConfiguration' to get a fresh copy of the `vsicons` configurations
        const mergedConfig = lodash_1.cloneDeep(this.vscodeManager.workspace.getConfiguration()[constants_1.constants.vsicons.name]);
        const files = this.configuration.inspect(constants_1.constants.vsicons.associations.filesSetting);
        mergedConfig.associations.files = lodash_1.unionWith(files.workspaceValue, files.globalValue, lodash_1.isEqual);
        const folders = this.configuration.inspect(constants_1.constants.vsicons.associations.foldersSetting);
        mergedConfig.associations.folders = lodash_1.unionWith(folders.workspaceValue, folders.globalValue, lodash_1.isEqual);
        return mergedConfig;
    }
    static removeSettings() {
        const vscodeSettingsFilePath = utils_1.Utils.pathUnixJoin(this.getAppUserPath(path_1.dirname(__filename)), constants_1.constants.vscode.settingsFilename);
        const replacer = (rawText) => {
            rawText = this.removeVSIconsConfigs(rawText);
            rawText = this.resetIconTheme(rawText);
            rawText = this.removeLastEntryTrailingComma(rawText);
            return rawText;
        };
        return utils_1.Utils.updateFile(vscodeSettingsFilePath, replacer).then(void 0, error => errorHandler_1.ErrorHandler.logError(error));
    }
    static getAppUserPath(dirPath) {
        const vscodeAppName = /[\\|/]\.vscode-oss-dev/i.test(dirPath)
            ? 'code-oss-dev'
            : /[\\|/]\.vscode-oss/i.test(dirPath)
                ? 'Code - OSS'
                : /[\\|/]\.vscode-insiders/i.test(dirPath)
                    ? 'Code - Insiders'
                    : /[\\|/]\.vscode/i.test(dirPath)
                        ? 'Code'
                        : 'user-data';
        // workaround until `process.env.VSCODE_PORTABLE` gets available
        const vscodePortable = () => {
            if (vscodeAppName !== 'user-data') {
                return undefined;
            }
            let dataDir;
            switch (process.platform) {
                case 'darwin':
                    const isInsiders = fs_1.existsSync(utils_1.Utils.pathUnixJoin(process.env.VSCODE_CWD, 'code-insiders-portable-data'));
                    dataDir = `code-${isInsiders ? 'insiders-' : ''}portable-data`;
                    break;
                default:
                    dataDir = 'data';
                    break;
            }
            return utils_1.Utils.pathUnixJoin(process.env.VSCODE_CWD, dataDir);
        };
        const appPath = process.env.VSCODE_PORTABLE ||
            vscodePortable() ||
            utils_1.Utils.getAppDataDirPath();
        return utils_1.Utils.pathUnixJoin(appPath, vscodeAppName, 'User');
    }
    static removeVSIconsConfigs(source) {
        const findLinesToRemove = () => {
            const linesToRemove = [];
            const regexp = new RegExp(`^\\s*"${constants_1.constants.vsicons.name}\\.`);
            const addTo = (value, index, array) => {
                if (!regexp.test(value)) {
                    return;
                }
                linesToRemove.push(index);
                let counter = 0;
                if (/[\{\[]\s*$/.test(array[index])) {
                    counter++;
                    while (counter > 0) {
                        linesToRemove.push(++index);
                        if (/[\{\[]/.test(array[index])) {
                            counter++;
                        }
                        if (/[\}\]]/.test(array[index])) {
                            counter--;
                        }
                    }
                }
            };
            source.forEach(addTo);
            return linesToRemove;
        };
        findLinesToRemove().forEach((lineIndex, i) => source.splice(lineIndex - i, 1));
        return source;
    }
    static resetIconTheme(source) {
        const foundLineIndex = source.findIndex(line => line.includes(constants_1.constants.vscode.iconThemeSetting) &&
            line.includes(constants_1.constants.extension.name));
        if (foundLineIndex > -1) {
            source.splice(foundLineIndex, 1);
        }
        return source;
    }
    static removeLastEntryTrailingComma(source) {
        const lastSettingsLine = source.lastIndexOf('}') - 1;
        if (lastSettingsLine < 0) {
            return source;
        }
        source[lastSettingsLine] = source[lastSettingsLine].replace(/,\s*$/, '');
        return source;
    }
    hasConfigChanged(currentConfig, sections) {
        const filter = (obj, keys) => Reflect.ownKeys(obj || {})
            .filter((key, __, array) => (keys || array).indexOf(key) !== -1)
            .reduce((nObj, key) => (Object.assign({}, nObj, { [key]: obj[key] })), {});
        const a = filter(this.initVSIconsConfig, sections);
        const b = filter(currentConfig, sections);
        return !lodash_1.isEqual(a, b);
    }
    getCustomIconsDirPath(dirPath) {
        if (!dirPath) {
            return this.vscodeManager.getAppUserDirPath();
        }
        const workspacePaths = this.vscodeManager.getWorkspacePaths();
        const dPath = dirPath.trim();
        if (path_1.isAbsolute(dPath) || !workspacePaths || !workspacePaths.length) {
            return dPath;
        }
        const absWspPath = workspacePaths.find(wsp => fs_1.existsSync(wsp)) || '';
        return utils_1.Utils.pathUnixJoin(absWspPath, dPath);
    }
    getIconTheme() {
        return this.configuration.get(constants_1.constants.vscode.iconThemeSetting);
    }
    getPreset(presetName) {
        return this.configuration.inspect(presetName);
    }
    updateDontShowNewVersionMessage(value) {
        return this.configuration.update(constants_1.constants.vsicons.dontShowNewVersionMessageSetting, value, models_1.ConfigurationTarget.Global);
    }
    updateDontShowConfigManuallyChangedMessage(value) {
        return this.configuration.update(constants_1.constants.vsicons.dontShowConfigManuallyChangedMessageSetting, value, models_1.ConfigurationTarget.Global);
    }
    updateAutoReload(value) {
        return this.configuration.update(constants_1.constants.vsicons.projectDetectionAutoReloadSetting, value, models_1.ConfigurationTarget.Global);
    }
    updateDisableDetection(value) {
        return this.configuration.update(constants_1.constants.vsicons.projectDetectionDisableDetectSetting, value, models_1.ConfigurationTarget.Global);
    }
    updateIconTheme() {
        return this.configuration.update(constants_1.constants.vscode.iconThemeSetting, constants_1.constants.extension.name, models_1.ConfigurationTarget.Global);
    }
    updatePreset(presetName, value, configurationTarget) {
        const removePreset = this.configuration.inspect(`${constants_1.constants.vsicons.presets.fullname}.${presetName}`).defaultValue === value;
        return this.configuration.update(`${constants_1.constants.vsicons.presets.fullname}.${presetName}`, removePreset ? undefined : value, configurationTarget);
    }
}
exports.ConfigManager = ConfigManager;
