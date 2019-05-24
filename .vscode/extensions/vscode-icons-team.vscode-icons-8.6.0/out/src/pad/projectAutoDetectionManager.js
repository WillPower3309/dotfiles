"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const models = require("../models");
const utils_1 = require("../utils");
const iconsManifest_1 = require("../iconsManifest");
const errorHandler_1 = require("../errorHandler");
const constants_1 = require("../constants");
class ProjectAutoDetectionManager {
    constructor(vscodeManager, configManager) {
        this.vscodeManager = vscodeManager;
        this.configManager = configManager;
        if (!vscodeManager) {
            throw new ReferenceError(`'vscodeManager' not set to an instance`);
        }
        if (!configManager) {
            throw new ReferenceError(`'configManager' not set to an instance`);
        }
    }
    detectProjects(projects) {
        if (!projects || !projects.length) {
            return Promise.resolve(null);
        }
        const promise = this.configManager.vsicons.projectDetection.disableDetect
            ? Promise.resolve(null)
            : this.vscodeManager.workspace.findFiles('**/package.json', '**/node_modules/**');
        return promise.then(results => this.detect(results, projects), error => errorHandler_1.ErrorHandler.logError(error));
    }
    detect(results, projects) {
        if (!results || !results.length) {
            return;
        }
        let detectionResult;
        for (const project of projects) {
            detectionResult = this.checkForProject(results, project);
            if (detectionResult.apply) {
                break;
            }
        }
        return detectionResult;
    }
    checkForProject(results, project) {
        const _getPresetName = (_project) => {
            switch (_project) {
                case models.Projects.angular:
                    return constants_1.constants.vsicons.presets.angular;
                case models.Projects.nestjs:
                    return constants_1.constants.vsicons.presets.nestjs;
                default:
                    break;
            }
        };
        // We need to check only the 'workspaceValue' ('user' setting should be ignored)
        const preset = this.configManager.getPreset(_getPresetName(project)).workspaceValue;
        const iconsDisabled = iconsManifest_1.ManifestReader.iconsDisabled(project);
        // NOTE: User setting (preset) bypasses detection in the following cases:
        // 1. Preset is set to 'false' and icons are not present in the manifest file
        // 2. Preset is set to 'true' and icons are present in the manifest file
        // For this cases PAD will not display a message
        let bypass = preset != null &&
            ((!preset && iconsDisabled) || (preset && !iconsDisabled));
        if (bypass) {
            return { apply: false };
        }
        // We need to mandatory check the following:
        // 1. The project related icons are present in the manifest file
        // 2. It's a detectable project
        // 3. The preset (when it's defined)
        // Use case: User has the preset set but project detection does not detect that project
        const projectInfo = this.getProjectInfo(results, project);
        const enableIcons = iconsDisabled && (!!projectInfo || preset === true);
        const disableIcons = !iconsDisabled && (!projectInfo || preset === false);
        // Don't check for conflicting projects if user setting (preset) is explicitly set
        const conflictingProjects = preset
            ? []
            : this.checkForConflictingProjects(results, project, enableIcons);
        // bypass, if user explicitly has any preset of a conficting project set
        // and those icons are enabled
        bypass = conflictingProjects.some(cp => this.configManager.getPreset(_getPresetName(cp))
            .workspaceValue && !iconsManifest_1.ManifestReader.iconsDisabled(cp));
        if (bypass || (!enableIcons && !disableIcons)) {
            return { apply: false };
        }
        const langResourceKey = conflictingProjects.length
            ? models.LangResourceKeys.conflictProjectsDetected
            : this.getDetectionLanguageResourseKey(project, enableIcons, preset);
        return {
            apply: true,
            project,
            conflictingProjects,
            langResourceKey,
            value: enableIcons || !disableIcons,
        };
    }
    checkForConflictingProjects(results, project, enableIcons) {
        if (!enableIcons) {
            return [];
        }
        const conflictingProjects = (conflictProjects) => conflictProjects.filter((cp) => this.getProjectInfo(results, cp) !== null);
        switch (project) {
            case models.Projects.nestjs:
                return conflictingProjects([models.Projects.angular]);
            case models.Projects.angular:
                return conflictingProjects([models.Projects.nestjs]);
            default:
                return [];
        }
    }
    getDetectionLanguageResourseKey(project, enableIcons, preset) {
        switch (project) {
            case models.Projects.angular:
                return this.getNgRelatedMessages(enableIcons, preset);
            case models.Projects.nestjs:
                return this.getNestRelatedMessages(enableIcons, preset);
        }
    }
    getNgRelatedMessages(enableIcons, preset) {
        return enableIcons
            ? preset === true
                ? models.LangResourceKeys.nonNgDetectedPresetTrue
                : models.LangResourceKeys.ngDetected
            : preset === false
                ? models.LangResourceKeys.ngDetectedPresetFalse
                : models.LangResourceKeys.nonNgDetected;
    }
    getNestRelatedMessages(enableIcons, preset) {
        return enableIcons
            ? preset === true
                ? models.LangResourceKeys.nonNestDetectedPresetTrue
                : models.LangResourceKeys.nestDetected
            : preset === false
                ? models.LangResourceKeys.nestDetectedPresetFalse
                : models.LangResourceKeys.nonNestDetected;
    }
    getProjectInfo(results, project) {
        let projectInfo = null;
        for (const result of results) {
            const content = fs_1.readFileSync(result.fsPath, 'utf8');
            const projectJson = utils_1.Utils.parseJSON(content);
            projectInfo = this.getInfo(projectJson, project);
            if (!!projectInfo) {
                break;
            }
        }
        return projectInfo;
    }
    getInfo(projectJson, name) {
        if (!projectJson) {
            return null;
        }
        const _getInfo = (key) => {
            if (projectJson.dependencies && !!projectJson.dependencies[key]) {
                return { name, version: projectJson.dependencies[key] };
            }
            if (projectJson.devDependencies && !!projectJson.devDependencies[key]) {
                return { name, version: projectJson.devDependencies[key] };
            }
            return null;
        };
        switch (name) {
            case models.Projects.angular:
                return _getInfo('@angular/core');
            case models.Projects.nestjs:
                return _getInfo('@nestjs/core');
            default:
                return null;
        }
    }
}
exports.ProjectAutoDetectionManager = ProjectAutoDetectionManager;
