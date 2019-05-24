"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const manifest = require("../../../package.json");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const errorHandler_1 = require("../errorHandler");
const customsMerger_1 = require("./customsMerger");
const manifestBuilder_1 = require("./manifestBuilder");
const supportedExtensions_1 = require("./supportedExtensions");
const supportedFolders_1 = require("./supportedFolders");
class IconsGenerator {
    constructor(vscodeManager, configManager) {
        this.vscodeManager = vscodeManager;
        this.configManager = configManager;
        // register event listener for configuration changes
        if (this.vscodeManager) {
            this.vscodeManager.workspace.onDidChangeConfiguration(this.didChangeConfigurationListener, this, this.vscodeManager.context.subscriptions);
        }
    }
    generateIconsManifest(files, folders, projectDetectionResult) {
        // default icons manifest
        if (!files && !folders) {
            return manifestBuilder_1.ManifestBuilder.buildManifest(supportedExtensions_1.extensions, supportedFolders_1.extensions);
        }
        // customs merged icons manifest
        if (!this.configManager) {
            throw new ReferenceError(`'configManager' not set to an instance`);
        }
        const vsiconsConfig = this.configManager.vsicons;
        const merged = customsMerger_1.CustomsMerger.merge(files, supportedExtensions_1.extensions, folders, supportedFolders_1.extensions, vsiconsConfig.presets, projectDetectionResult, this.affectedPresets);
        const customIconsDirPath = this.configManager.getCustomIconsDirPath(vsiconsConfig.customIconFolderPath);
        const iconsManifest = manifestBuilder_1.ManifestBuilder.buildManifest(merged.files, merged.folders, customIconsDirPath);
        // apply non icons related config settings
        iconsManifest.hidesExplorerArrows =
            vsiconsConfig.presets.hideExplorerArrows;
        return iconsManifest;
    }
    persist(iconsManifest, updatePackageJson = false) {
        const iconsManifestDirPath = path_1.join(__dirname, '../../../', 'out/src');
        this.writeIconsManifestToFile(constants_1.constants.iconsManifest.filename, iconsManifest, iconsManifestDirPath);
        if (updatePackageJson) {
            const iconsFolderRelativePath = `${utils_1.Utils.getRelativePath('.', iconsManifestDirPath)}${constants_1.constants.iconsManifest.filename}`;
            return this.updatePackageJson(iconsFolderRelativePath);
        }
        return Promise.resolve();
    }
    writeIconsManifestToFile(iconsFilename, iconsManifest, outDir) {
        try {
            if (!fs_1.existsSync(outDir)) {
                fs_1.mkdirSync(outDir);
            }
            fs_1.writeFileSync(utils_1.Utils.pathUnixJoin(outDir, iconsFilename), JSON.stringify(iconsManifest, null, 2));
            // tslint:disable-next-line no-console
            console.info(`[${constants_1.constants.extension.name}] Icons manifest file successfully generated!`);
        }
        catch (error) {
            errorHandler_1.ErrorHandler.logError(error);
        }
    }
    updatePackageJson(iconsFolderPath) {
        const oldIconsThemesFolderPath = manifest.contributes.iconThemes[0].path;
        const replacer = (rawText) => {
            const foundLineIndex = rawText.findIndex(line => line.includes('"path"') &&
                line.includes(constants_1.constants.iconsManifest.filename));
            if (foundLineIndex < 0) {
                return rawText;
            }
            const dotEscapedFilename = constants_1.constants.iconsManifest.filename.replace('.', '\\.');
            rawText[foundLineIndex] = rawText[foundLineIndex].replace(new RegExp(`(.*").*${dotEscapedFilename}(.*".*)`), `$1${iconsFolderPath}$2`);
            return rawText;
        };
        if (!oldIconsThemesFolderPath ||
            oldIconsThemesFolderPath === iconsFolderPath) {
            return Promise.resolve();
        }
        return utils_1.Utils.updateFile(utils_1.Utils.pathUnixJoin(__dirname, '../../../', 'package.json'), replacer).then(() => 
        // tslint:disable-next-line no-console
        console.info(`[${constants_1.constants.extension.name}] Icons path in 'package.json' updated`), (error) => errorHandler_1.ErrorHandler.logError(error));
    }
    didChangeConfigurationListener(e) {
        if (!e || !e.affectsConfiguration) {
            throw new Error(`Unsupported 'vscode' version: ${this.vscodeManager.version}`);
        }
        this.affectedPresets = {
            angular: e.affectsConfiguration(constants_1.constants.vsicons.presets.angular),
            nestjs: e.affectsConfiguration(constants_1.constants.vsicons.presets.nestjs),
            jsOfficial: false,
            tsOfficial: false,
            jsonOfficial: false,
            foldersAllDefaultIcon: false,
            hideExplorerArrows: false,
            hideFolders: false,
        };
    }
}
exports.IconsGenerator = IconsGenerator;
