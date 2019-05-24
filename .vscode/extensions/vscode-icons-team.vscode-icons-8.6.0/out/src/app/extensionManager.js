"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../models");
const manifest = require("../../../package.json");
const constants_1 = require("../constants");
const iconsManifest_1 = require("../iconsManifest");
const errorHandler_1 = require("../errorHandler");
const utils_1 = require("../utils");
class ExtensionManager {
    //#endregion
    //#region Constructor
    constructor(vscodeManager, configManager, settingsManager, notificationManager, iconsGenerator, projectAutoDetectionManager) {
        this.vscodeManager = vscodeManager;
        this.configManager = configManager;
        this.settingsManager = settingsManager;
        this.notificationManager = notificationManager;
        this.iconsGenerator = iconsGenerator;
        this.projectAutoDetectionManager = projectAutoDetectionManager;
        // register event listener for configuration changes
        this.vscodeManager.workspace.onDidChangeConfiguration(this.didChangeConfigurationListener, this, this.vscodeManager.context.subscriptions);
    }
    //#endregion
    //#region Public functions
    activate() {
        // function calls has to be done in this order strictly
        this.settingsManager.moveStateFromLegacyPlace();
        this.registerCommands(manifest.contributes.commands);
        this.manageIntroMessage();
        this.manageCustomizations();
        this.projectAutoDetectionManager
            .detectProjects([models.Projects.angular, models.Projects.nestjs])
            .then((detectionResult) => this.applyProjectDetection(detectionResult));
        // Update the version in settings
        if (this.settingsManager.isNewVersion) {
            this.settingsManager.updateStatus();
        }
    }
    //#endregion
    //#region Private functions
    registerCommands(commands) {
        commands.forEach(command => {
            this.vscodeManager.context.subscriptions.push(this.vscodeManager.commands.registerCommand(command.command, Reflect.get(this, command.callbackName) || (() => void 0), this));
        });
    }
    manageIntroMessage() {
        if (!this.settingsManager.getState().welcomeShown &&
            this.configManager.getIconTheme() !== constants_1.constants.extension.name) {
            this.showWelcomeMessage();
            return;
        }
        if (this.settingsManager.isNewVersion &&
            !this.configManager.vsicons.dontShowNewVersionMessage) {
            this.showNewVersionMessage();
        }
    }
    manageCustomizations() {
        const configChanged = this.settingsManager.isNewVersion &&
            this.configManager.hasConfigChanged(utils_1.Utils.unflattenProperties(manifest.contributes.configuration.properties, 'default').vsicons, [constants_1.constants.vsicons.presets.name, constants_1.constants.vsicons.associations.name]);
        if (configChanged) {
            this.applyCustomizationCommand();
        }
    }
    showWelcomeMessage() {
        const displayMessage = () => this.notificationManager
            .notifyInfo(models.LangResourceKeys.welcome, models.LangResourceKeys.activate, models.LangResourceKeys.aboutOfficialApi, models.LangResourceKeys.seeReadme)
            .then(btn => {
            switch (btn) {
                case models.LangResourceKeys.activate:
                    this.activationCommand();
                    break;
                case models.LangResourceKeys.aboutOfficialApi: {
                    utils_1.Utils.open(constants_1.constants.urlOfficialApi);
                    // Display the message again so the user can choose to activate or not
                    return displayMessage();
                }
                case models.LangResourceKeys.seeReadme: {
                    utils_1.Utils.open(constants_1.constants.urlReadme);
                    // Display the message again so the user can choose to activate or not
                    return displayMessage();
                }
                default:
                    break;
            }
        }, reason => errorHandler_1.ErrorHandler.logError(reason));
        return displayMessage();
    }
    showNewVersionMessage() {
        return this.notificationManager
            .notifyInfo(`%s v${constants_1.constants.extension.version}`, models.LangResourceKeys.newVersion, models.LangResourceKeys.seeReleaseNotes, models.LangResourceKeys.dontShowThis)
            .then(btn => {
            switch (btn) {
                case models.LangResourceKeys.seeReleaseNotes:
                    utils_1.Utils.open(constants_1.constants.urlReleaseNote);
                    break;
                case models.LangResourceKeys.dontShowThis:
                    return this.configManager.updateDontShowNewVersionMessage(true);
                default:
                    break;
            }
        }, reason => errorHandler_1.ErrorHandler.logError(reason));
    }
    showCustomizationMessage(message, items, callback, cbArgs) {
        this.customMsgShown = true;
        return this.notificationManager
            .notifyInfo(message, ...items)
            .then(btn => this.handleAction(btn, callback, cbArgs), reason => errorHandler_1.ErrorHandler.logError(reason));
    }
    activationCommand() {
        this.configManager.updateIconTheme();
    }
    applyCustomizationCommand(additionalTitles = []) {
        this.showCustomizationMessage(`%s %s`, [
            models.LangResourceKeys.iconCustomization,
            models.LangResourceKeys.restart,
            models.LangResourceKeys.reload,
            ...additionalTitles,
        ], this.applyCustomization);
    }
    // @ts-ignore: Called via reflection
    restoreDefaultManifestCommand() {
        this.showCustomizationMessage(`%s %s`, [
            models.LangResourceKeys.iconRestore,
            models.LangResourceKeys.restart,
            models.LangResourceKeys.reload,
        ], this.restoreManifest);
    }
    // @ts-ignore: Called via reflection
    resetProjectDetectionDefaultsCommand() {
        this.showCustomizationMessage(`%s %s`, [
            models.LangResourceKeys.projectDetectionReset,
            models.LangResourceKeys.restart,
            models.LangResourceKeys.reload,
        ], this.resetProjectDetectionDefaults);
    }
    // @ts-ignore: Called via reflection
    toggleAngularPresetCommand() {
        this.togglePreset(models.PresetNames.angular, models.CommandNames.ngPreset, false, models.ConfigurationTarget.Workspace);
    }
    // @ts-ignore: Called via reflection
    toggleNestPresetCommand() {
        this.togglePreset(models.PresetNames.nestjs, models.CommandNames.nestPreset, false, models.ConfigurationTarget.Workspace);
    }
    // @ts-ignore: Called via reflection
    toggleJsPresetCommand() {
        this.togglePreset(models.PresetNames.jsOfficial, models.CommandNames.jsPreset, false, models.ConfigurationTarget.Global);
    }
    // @ts-ignore: Called via reflection
    toggleTsPresetCommand() {
        this.togglePreset(models.PresetNames.tsOfficial, models.CommandNames.tsPreset, false, models.ConfigurationTarget.Global);
    }
    // @ts-ignore: Called via reflection
    toggleJsonPresetCommand() {
        this.togglePreset(models.PresetNames.jsonOfficial, models.CommandNames.jsonPreset, false, models.ConfigurationTarget.Global);
    }
    // @ts-ignore: Called via reflection
    toggleHideFoldersPresetCommand() {
        this.togglePreset(models.PresetNames.hideFolders, models.CommandNames.hideFoldersPreset, true, models.ConfigurationTarget.Global);
    }
    // @ts-ignore: Called via reflection
    toggleFoldersAllDefaultIconPresetCommand() {
        this.togglePreset(models.PresetNames.foldersAllDefaultIcon, models.CommandNames.foldersAllDefaultIconPreset, true, models.ConfigurationTarget.Global);
    }
    // @ts-ignore: Called via reflection
    toggleHideExplorerArrowsPresetCommand() {
        this.togglePreset(models.PresetNames.hideExplorerArrows, models.CommandNames.hideExplorerArrowsPreset, true, models.ConfigurationTarget.Global);
    }
    executeAndReload(callback, cbArgs) {
        if (callback) {
            callback.apply(this, cbArgs);
        }
        // reload
        this.vscodeManager.commands.executeCommand(constants_1.constants.vscode.reloadWindowActionSetting);
    }
    handleAction(btn, callback, cbArgs) {
        if (!btn) {
            this.customMsgShown = false;
            return Promise.resolve();
        }
        const setPreset = (project, preset) => {
            cbArgs[0].project = project;
            this.configManager.updatePreset(models.PresetNames[preset], true, models.ConfigurationTarget.Workspace);
            this.handleUpdatePreset(callback, cbArgs);
        };
        this.callback = callback;
        let retVal;
        switch (btn) {
            case models.ProjectNames.ng:
                setPreset(models.Projects.angular, models.PresetNames.angular);
                break;
            case models.ProjectNames.nest:
                setPreset(models.Projects.nestjs, models.PresetNames.nestjs);
                break;
            case models.LangResourceKeys.dontShowThis: {
                this.doReload = false;
                if (!callback) {
                    break;
                }
                switch (callback.name) {
                    case 'applyCustomization': {
                        this.customMsgShown = false;
                        retVal = this.configManager.updateDontShowConfigManuallyChangedMessage(true);
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case models.LangResourceKeys.disableDetect: {
                this.doReload = false;
                retVal = this.configManager.updateDisableDetection(true);
                break;
            }
            case models.LangResourceKeys.autoReload: {
                retVal = this.configManager
                    .updateAutoReload(true)
                    .then(() => this.handleUpdatePreset(callback, cbArgs));
                break;
            }
            case models.LangResourceKeys.reload: {
                if (!cbArgs || cbArgs.length !== 3) {
                    this.executeAndReload(callback, cbArgs);
                    break;
                }
                this.handleUpdatePreset(callback, cbArgs);
                break;
            }
            default:
                break;
        }
        return retVal || Promise.resolve();
    }
    handleUpdatePreset(callback, cbArgs) {
        if (!callback) {
            throw new Error('Callback function missing');
        }
        if (!cbArgs || !cbArgs.length) {
            throw new Error('Arguments missing');
        }
        // If the preset is the same as the toggle value then trigger an explicit reload
        // Note: This condition works also for auto-reload handling
        if (this.configManager.vsicons.presets[cbArgs[0]] === cbArgs[1]) {
            this.executeAndReload(this.applyCustomization, cbArgs);
        }
        else {
            if (cbArgs.length !== 3) {
                throw new Error('Arguments mismatch');
            }
            this.doReload = true;
            this.callback = this.applyCustomization;
            callback.apply(this.configManager, cbArgs);
        }
    }
    applyProjectDetection(projectDetectionResult) {
        if (!projectDetectionResult || !projectDetectionResult.apply) {
            return;
        }
        if (!(projectDetectionResult.conflictingProjects &&
            projectDetectionResult.conflictingProjects.length) &&
            this.configManager.vsicons.projectDetection.autoReload) {
            this.executeAndReload(this.applyCustomization, [projectDetectionResult]);
            return;
        }
        const items = projectDetectionResult.conflictingProjects &&
            projectDetectionResult.conflictingProjects.length
            ? [
                models.ProjectNames[projectDetectionResult.project],
                ...projectDetectionResult.conflictingProjects.map(cp => models.ProjectNames[cp]),
            ]
            : [
                models.LangResourceKeys.reload,
                models.LangResourceKeys.autoReload,
                models.LangResourceKeys.disableDetect,
            ];
        this.showCustomizationMessage(projectDetectionResult.langResourceKey, items, this.applyCustomization, [projectDetectionResult]);
    }
    togglePreset(preset, command, reverseAction, configurationTarget) {
        const presetName = models.PresetNames[preset];
        const commandName = models.CommandNames[command];
        const toggledValue = iconsManifest_1.ManifestReader.getToggledValue(preset, this.configManager.vsicons.presets);
        const action = reverseAction
            ? toggledValue
                ? 'Disabled'
                : 'Enabled'
            : toggledValue
                ? 'Enabled'
                : 'Disabled';
        if (!Reflect.has(models.LangResourceKeys, `${commandName}${action}`)) {
            throw Error(`${commandName}${action} is not valid`);
        }
        this.showCustomizationMessage('%s %s', [
            models.LangResourceKeys[`${commandName}${action}`],
            models.LangResourceKeys.restart,
            models.LangResourceKeys.reload,
        ], this.configManager.updatePreset, [presetName, toggledValue, configurationTarget]);
    }
    applyCustomization(projectDetectionResult) {
        const associations = this.configManager.vsicons.associations;
        const customFiles = {
            default: associations.fileDefault,
            supported: associations.files,
        };
        const customFolders = {
            default: associations.folderDefault,
            supported: associations.folders,
        };
        const iconsManifest = this.iconsGenerator.generateIconsManifest(customFiles, customFolders, projectDetectionResult);
        this.iconsGenerator.persist(iconsManifest);
    }
    restoreManifest() {
        const iconsManifest = this.iconsGenerator.generateIconsManifest();
        this.iconsGenerator.persist(iconsManifest);
    }
    resetProjectDetectionDefaults() {
        // We always need a fresh 'vsicons' configuration when checking the values
        // to take into account for user manually changed values
        if (this.configManager.vsicons.projectDetection.autoReload) {
            this.configManager.updateAutoReload(false);
        }
        if (this.configManager.vsicons.projectDetection.disableDetect) {
            this.configManager.updateDisableDetection(false);
        }
    }
    //#endregion
    //#region Event Listeners
    didChangeConfigurationListener(e) {
        if (!e || !e.affectsConfiguration) {
            throw new Error(`Unsupported 'vscode' version: ${this.vscodeManager.version}`);
        }
        // Update the status in extension settings
        if (e.affectsConfiguration(constants_1.constants.vscode.iconThemeSetting)) {
            const status = this.configManager.getIconTheme() === constants_1.constants.extension.name
                ? models.ExtensionStatus.activated
                : models.ExtensionStatus.deactivated;
            if (this.settingsManager.getState().status !== status) {
                this.settingsManager.updateStatus(status);
            }
            return;
        }
        // react only on 'vsicons.presets' and 'vsicons.associations' configuration changes
        if (!e.affectsConfiguration(constants_1.constants.vsicons.presets.fullname) &&
            !e.affectsConfiguration(constants_1.constants.vsicons.associations.fullname)) {
            return;
        }
        if (this.doReload) {
            this.doReload = false;
            // In case the 'user settings' file has just been created
            // a delay needs to be introduced, in order for the 'preset'
            // change to get persisted on disk
            setTimeout(() => this.executeAndReload(this.callback), 500);
        }
        else if (!this.customMsgShown) {
            const currentConfig = this.configManager.vsicons;
            const configChanged = !currentConfig.dontShowConfigManuallyChangedMessage &&
                this.configManager.hasConfigChanged(currentConfig, [
                    constants_1.constants.vsicons.presets.name,
                    constants_1.constants.vsicons.associations.name,
                ]);
            if (configChanged) {
                this.applyCustomizationCommand([models.LangResourceKeys.dontShowThis]);
            }
        }
        return;
    }
}
exports.ExtensionManager = ExtensionManager;
