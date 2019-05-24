"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const models = require("../models");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
class ManifestReader {
    static getToggledValue(preset, presets) {
        const isNonIconsRelatedPreset = () => [models.PresetNames.hideExplorerArrows].some(prst => prst === preset);
        const isFoldersRelatedPreset = () => [
            models.PresetNames.hideFolders,
            models.PresetNames.foldersAllDefaultIcon,
        ].some(prst => prst === preset);
        const presetName = models.PresetNames[preset];
        return isNonIconsRelatedPreset()
            ? !presets[presetName]
            : isFoldersRelatedPreset()
                ? !ManifestReader.folderIconsDisabled(presetName)
                : ManifestReader.iconsDisabled(models.IconNames[presetName]);
    }
    static iconsDisabled(name, isFile = true) {
        const iconManifest = this.getIconManifest();
        const iconsJson = utils_1.Utils.parseJSON(iconManifest);
        const prefix = isFile
            ? constants_1.constants.iconsManifest.definitionFilePrefix
            : constants_1.constants.iconsManifest.definitionFolderPrefix;
        const suffix = Reflect.ownKeys(models.Projects).some(key => models.Projects[key] === name)
            ? '_'
            : '';
        const defNamePattern = `${prefix}${name}${suffix}`;
        return (!iconsJson ||
            !Reflect.ownKeys(iconsJson.iconDefinitions).filter(key => key.toString().startsWith(defNamePattern)).length);
    }
    static folderIconsDisabled(presetName) {
        const manifest = this.getIconManifest();
        const iconsJson = utils_1.Utils.parseJSON(manifest);
        if (!iconsJson) {
            return true;
        }
        switch (models.PresetNames[presetName]) {
            case models.PresetNames.hideFolders:
                return (Reflect.ownKeys(iconsJson.folderNames).length === 0 &&
                    iconsJson.iconDefinitions._folder.iconPath === '');
            case models.PresetNames.foldersAllDefaultIcon:
                return (Reflect.ownKeys(iconsJson.folderNames).length === 0 &&
                    iconsJson.iconDefinitions._folder.iconPath !== '');
            default:
                throw new Error('Not Implemented');
        }
    }
    static getIconManifest() {
        const manifestFilePath = path_1.join(__dirname, '..', constants_1.constants.iconsManifest.filename);
        try {
            return fs_1.readFileSync(manifestFilePath, 'utf8');
        }
        catch (err) {
            return null;
        }
    }
}
exports.ManifestReader = ManifestReader;
