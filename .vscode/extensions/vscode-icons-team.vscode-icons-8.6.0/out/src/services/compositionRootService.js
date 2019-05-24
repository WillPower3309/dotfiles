"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const models_1 = require("../models");
const vscodeManager_1 = require("../vscode/vscodeManager");
const configManager_1 = require("../configuration/configManager");
const settingsManager_1 = require("../settings/settingsManager");
const notificationManager_1 = require("../notification/notificationManager");
const iconsManifest_1 = require("../iconsManifest");
const languageResourceManager_1 = require("../i18n/languageResourceManager");
const langResourceCollection_1 = require("../i18n/langResourceCollection");
const projectAutoDetectionManager_1 = require("../pad/projectAutoDetectionManager");
const extensionManager_1 = require("../app/extensionManager");
class CompositionRootService {
    constructor(context) {
        this.container = [];
        if (context) {
            this.register(context);
        }
    }
    get(identifier) {
        const result = this.container.find(element => {
            return element.identifier === identifier;
        });
        if (!result) {
            throw new Error(`Object not found for: ${identifier.toString()}`);
        }
        return result.obj;
    }
    register(context) {
        const vscodeManager = this.bind(models_1.SYMBOLS.IVSCodeManager, vscodeManager_1.VSCodeManager, vscode, context);
        const configManager = this.bind(models_1.SYMBOLS.IConfigManager, configManager_1.ConfigManager, vscodeManager);
        const settingsManager = this.bind(models_1.SYMBOLS.ISettingsManager, settingsManager_1.SettingsManager, vscodeManager);
        const iconsGenerator = this.bind(models_1.SYMBOLS.IIconsGenerator, iconsManifest_1.IconsGenerator, vscodeManager, configManager);
        const languageResourceManager = this.bind(models_1.SYMBOLS.ILanguageResourceManager, languageResourceManager_1.LanguageResourceManager, langResourceCollection_1.langResourceCollection[vscode.env.language]);
        const notificationManager = this.bind(models_1.SYMBOLS.INotificationManager, notificationManager_1.NotificationManager, vscodeManager, languageResourceManager);
        const projectAutoDetectionManager = this.bind(models_1.SYMBOLS.IProjectAutoDetectionManager, projectAutoDetectionManager_1.ProjectAutoDetectionManager, vscodeManager, configManager);
        this.bind(models_1.SYMBOLS.IExtensionManager, extensionManager_1.ExtensionManager, vscodeManager, configManager, settingsManager, notificationManager, iconsGenerator, projectAutoDetectionManager);
    }
    bind(identifier, obj, ...args) {
        if (!identifier) {
            throw new ReferenceError('Identifier cannot be undefined');
        }
        const bindedObj = Reflect.construct(obj, args);
        this.container.push({ identifier, obj: bindedObj });
        return bindedObj;
    }
}
exports.CompositionRootService = CompositionRootService;
