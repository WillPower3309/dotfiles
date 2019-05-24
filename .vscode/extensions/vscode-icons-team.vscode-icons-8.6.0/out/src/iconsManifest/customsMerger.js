"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const models = require("../models");
const manifestReader_1 = require("./manifestReader");
class CustomsMerger {
    static merge(customFiles, extFiles, customFolders, extFolders, presets, projectDetectionResult, affectedPresets) {
        const projectPresets = this.getProjectPresets([models.PresetNames.angular, models.PresetNames.nestjs], projectDetectionResult, presets, affectedPresets);
        let { files, folders } = this.mergeCustoms(customFiles || { default: {}, supported: [] }, extFiles, customFolders || { default: {}, supported: [] }, extFolders);
        files = this.toggleProjectPreset(projectPresets, files, extFiles);
        files = this.toggleOfficialIconsPreset(!presets.jsOfficial, files, [models.IconNames.jsOfficial], [models.IconNames.js]);
        files = this.toggleOfficialIconsPreset(!presets.tsOfficial, files, [models.IconNames.tsOfficial, models.IconNames.tsDefOfficial], [models.IconNames.ts, models.IconNames.tsDef]);
        files = this.toggleOfficialIconsPreset(!presets.jsonOfficial, files, [models.IconNames.jsonOfficial], [models.IconNames.json]);
        folders = this.toggleFoldersAllDefaultIconPreset(presets.foldersAllDefaultIcon, folders, extFolders);
        folders = this.toggleHideFoldersPreset(presets.hideFolders, folders);
        return { files, folders };
    }
    static getProjectPresets(presetNames, projectDetectionResult, presets, affectedPresets) {
        const projectPresets = [];
        for (const presetName of presetNames) {
            const preset = this.getPreset(presetName, projectDetectionResult, presets, affectedPresets);
            projectPresets.push({ [presetName]: !preset });
        }
        return projectPresets;
    }
    static getPreset(presetName, projectDetectionResult, presets, affectedPresets) {
        const hasProjectDetectionResult = !!projectDetectionResult &&
            typeof projectDetectionResult === 'object' &&
            'value' in projectDetectionResult;
        const name = models.PresetNames[presetName];
        const project = models.Projects[name];
        return hasProjectDetectionResult &&
            projectDetectionResult.project === project
            ? projectDetectionResult.value
            : presets[name] ||
                (!!affectedPresets &&
                    !affectedPresets[name] &&
                    !manifestReader_1.ManifestReader.iconsDisabled(project));
    }
    static toggleProjectPreset(projectPresets, customFiles, defaultFiles) {
        let files = customFiles;
        for (const preset of projectPresets) {
            const key = Object.keys(preset)[0];
            const disable = preset[key];
            const regex = new RegExp(`^${models.IconNames[models.PresetNames[key]]}_.*\\D$`);
            const icons = files.supported
                .filter(x => regex.test(x.icon))
                .map(x => x.icon);
            const defaultIcons = defaultFiles.supported
                .filter(x => regex.test(x.icon))
                .map(x => x.icon);
            const temp = this.togglePreset(disable, icons, files);
            files = this.togglePreset(disable, defaultIcons, temp);
        }
        return files;
    }
    static toggleOfficialIconsPreset(disable, customFiles, officialIcons, defaultIcons) {
        const temp = this.togglePreset(disable, officialIcons, customFiles);
        return this.togglePreset(!disable, defaultIcons, temp);
    }
    static toggleFoldersAllDefaultIconPreset(disable, customFolders, defaultFolders) {
        const folderIcons = this.getNonDisabledIcons(customFolders);
        const defaultFolderIcons = defaultFolders.supported
            .filter(x => !x.disabled)
            .filter(x => 
        // Exclude overrides
        customFolders.supported.every(y => y.overrides !== x.icon))
            .filter(x => 
        // Exclude disabled by custom
        customFolders.supported
            .filter(y => x.icon === y.icon)
            .every(z => !z.disabled))
            .map(x => x.icon);
        const temp = this.togglePreset(disable, folderIcons, customFolders);
        const collection = this.togglePreset(disable, defaultFolderIcons, temp);
        collection.default.folder.disabled = customFolders.default.folder.disabled;
        if (customFolders.default.folder_light) {
            collection.default.folder_light.disabled =
                customFolders.default.folder_light.disabled;
        }
        collection.default.root_folder.disabled =
            customFolders.default.root_folder.disabled;
        if (customFolders.default.root_folder_light) {
            collection.default.root_folder_light.disabled =
                customFolders.default.root_folder_light.disabled;
        }
        return collection;
    }
    static toggleHideFoldersPreset(disable, customFolders) {
        const folderIcons = this.getNonDisabledIcons(customFolders);
        const collection = this.togglePreset(disable, folderIcons, customFolders);
        collection.default.folder.disabled =
            customFolders.default.folder.disabled || disable;
        if (customFolders.default.folder_light) {
            collection.default.folder_light.disabled =
                customFolders.default.folder_light.disabled || disable;
        }
        collection.default.root_folder.disabled =
            customFolders.default.root_folder.disabled || disable;
        if (customFolders.default.root_folder_light) {
            collection.default.root_folder_light.disabled =
                customFolders.default.root_folder_light.disabled || disable;
        }
        return collection;
    }
    static getNonDisabledIcons(customFolders) {
        return customFolders.supported.filter(x => !x.disabled).map(x => x.icon);
    }
    static mergeCustoms(customFiles, supportedFiles, customFolders, supportedFolders) {
        const files = {
            default: this.mergeDefaultFiles(customFiles.default, supportedFiles.default),
            supported: this.mergeSupported(customFiles.supported, supportedFiles.supported),
        };
        const folders = {
            default: this.mergeDefaultFolders(customFolders.default, supportedFolders.default),
            supported: this.mergeSupported(customFolders.supported, supportedFolders.supported),
        };
        return { files, folders };
    }
    static mergeDefaultFiles(custom, supported) {
        return {
            file: custom.file || supported.file,
            file_light: custom.file_light || supported.file_light,
        };
    }
    static mergeDefaultFolders(custom, supported) {
        return {
            folder: custom.folder || supported.folder,
            folder_light: custom.folder_light || supported.folder_light,
            root_folder: custom.root_folder || supported.root_folder,
            root_folder_light: custom.root_folder_light || supported.root_folder_light,
        };
    }
    static mergeSupported(custom, supported) {
        if (!custom || !custom.length) {
            return supported;
        }
        // start the merge operation
        let final = lodash_1.cloneDeep(supported);
        custom.forEach(file => {
            const officialFiles = final.filter(x => x.icon === file.icon);
            if (officialFiles.length) {
                // existing icon
                // checking if the icon is disabled
                if (file.disabled != null) {
                    officialFiles.forEach(x => (x.disabled = file.disabled));
                    if (file.disabled) {
                        return;
                    }
                }
                file.format = officialFiles[0].format;
            }
            // extends? => copy the icon name to the existing ones.
            // override? => remove overriden extension.
            // check for exentensions in use.
            // we'll add a new node
            if (file.extends) {
                final
                    .filter(x => x.icon === file.extends)
                    .forEach(x => (x.icon = file.icon));
            }
            // remove overrides
            final = final.filter(x => x.icon !== file.overrides);
            // check if file extensions are already in use and remove them
            if (!file.extensions) {
                file.extensions = [];
            }
            file.extensions.forEach(ext => final
                .filter(x => x.extensions.find(y => y === ext))
                .forEach(x => lodash_1.remove(x.extensions, el => el === ext)));
            final.push(file);
        });
        return final;
    }
    // Note: generics and union types don't work very well :(
    // that's why we had to use IExtensionCollection<> instead of T
    static togglePreset(disable, icons, customItems) {
        const workingCopy = lodash_1.cloneDeep(customItems);
        icons.forEach(icon => {
            const existing = workingCopy.supported.filter(x => x.icon === icon);
            if (!existing.length) {
                workingCopy.supported.push({
                    icon,
                    extensions: [],
                    format: models.FileFormat.svg,
                    disabled: disable,
                });
            }
            else {
                existing.forEach(x => (x.disabled = disable));
            }
        });
        return workingCopy;
    }
}
exports.CustomsMerger = CustomsMerger;
