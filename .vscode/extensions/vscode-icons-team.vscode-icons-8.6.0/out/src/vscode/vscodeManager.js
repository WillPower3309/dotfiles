"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class VSCodeManager {
    constructor(vscode, extensionContext) {
        this.vscode = vscode;
        this.extensionContext = extensionContext;
        if (!vscode) {
            throw new ReferenceError(`'vscode' not set to an instance`);
        }
        if (!extensionContext) {
            throw new ReferenceError(`'extensionContext' not set to an instance`);
        }
    }
    get context() {
        return this.extensionContext;
    }
    get env() {
        return this.vscode.env;
    }
    get commands() {
        return this.vscode.commands;
    }
    get version() {
        return this.vscode.version;
    }
    get window() {
        return this.vscode.window;
    }
    get workspace() {
        return this.vscode.workspace;
    }
    getWorkspacePaths() {
        if (!this.workspace.workspaceFolders && !this.workspace.rootPath) {
            return [];
        }
        // 'workspaceFolders' on top of significance order
        if (this.workspace.workspaceFolders.length) {
            return this.workspace.workspaceFolders.reduce((a, b) => {
                a.push(b.uri.fsPath);
                return a;
            }, []);
        }
        return [this.workspace.rootPath];
    }
    // Hopefully at some point we will get
    // an ExtensionContext#globalStoragePath
    // through the API and replace this
    getAppUserDirPath() {
        // Reduce determining code usage
        // as the path needs to be calculated only once
        if (this.appUserDirPath) {
            return this.appUserDirPath;
        }
        const isDev = /dev/i.test(this.env.appName);
        const isOSS = !isDev && /oss/i.test(this.env.appName);
        const isInsiders = /insiders/i.test(this.env.appName);
        const appDataDirName = process.env.VSCODE_PORTABLE
            ? 'user-data'
            : isInsiders
                ? 'Code - Insiders'
                : isOSS
                    ? 'Code - OSS'
                    : isDev
                        ? 'code-oss-dev'
                        : 'Code';
        const appDataDirPath = process.env.VSCODE_PORTABLE || utils_1.Utils.getAppDataDirPath();
        this.appUserDirPath = utils_1.Utils.pathUnixJoin(appDataDirPath, appDataDirName, 'User');
        return this.appUserDirPath;
    }
}
exports.VSCodeManager = VSCodeManager;
