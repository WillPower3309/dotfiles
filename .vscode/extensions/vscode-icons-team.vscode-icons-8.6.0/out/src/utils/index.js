"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const opn = require("opn");
const fs = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const lodash_1 = require("lodash");
const models_1 = require("../models");
class Utils {
    static getAppDataDirPath() {
        switch (process.platform) {
            case 'darwin':
                return `${os_1.homedir()}/Library/Application Support`;
            case 'linux':
                return `${os_1.homedir()}/.config`;
            case 'win32':
                return process.env.APPDATA;
            default:
                return '/var/local';
        }
    }
    static pathUnixJoin(...paths) {
        return path_1.posix.join(...paths);
    }
    static tempPath() {
        return os_1.tmpdir();
    }
    static fileFormatToString(extension) {
        return `.${typeof extension === 'string' ? extension.trim() : models_1.FileFormat[extension]}`;
    }
    /**
     * Creates a directory and all subdirectories synchronously
     *
     * @param {any} dirPath The directory's path
     */
    static createDirectoryRecursively(dirPath) {
        dirPath.split(path_1.posix.sep).reduce((parentDir, childDir) => {
            const curDir = path_1.resolve(parentDir, childDir);
            if (!fs.existsSync(curDir)) {
                fs.mkdirSync(curDir);
            }
            return curDir;
        }, path_1.isAbsolute(dirPath) ? path_1.posix.sep : '');
    }
    /**
     * Deletes a directory and all subdirectories synchronously
     *
     * @param {any} dirPath The directory's path
     */
    static deleteDirectoryRecursively(dirPath) {
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach(file => {
                const curPath = `${dirPath}/${file}`;
                if (fs.lstatSync(curPath).isDirectory()) {
                    // recurse
                    this.deleteDirectoryRecursively(curPath);
                }
                else {
                    // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dirPath);
        }
    }
    /**
     * Converts a JavaScript Object Notation (JSON) string into an object
     * without throwing an exception.
     *
     * @param {string} text A valid JSON string.
     */
    static parseJSON(text) {
        try {
            return JSON.parse(text);
        }
        catch (err) {
            return null;
        }
    }
    static getRelativePath(fromDirPath, toDirName, checkDirectory = true) {
        if (fromDirPath == null) {
            throw new Error('fromDirPath not defined.');
        }
        if (toDirName == null) {
            throw new Error('toDirName not defined.');
        }
        if (checkDirectory && !fs.existsSync(toDirName)) {
            throw new Error(`Directory '${toDirName}' not found.`);
        }
        return path_1.relative(fromDirPath, toDirName)
            .replace(/\\/g, '/')
            .concat('/');
    }
    static removeFirstDot(txt) {
        return txt.replace(/^\./, '');
    }
    static belongToSameDrive(path1, path2) {
        const [val1, val2] = this.getDrives(path1, path2);
        return val1 === val2;
    }
    static overwriteDrive(sourcePath, destPath) {
        const [val1, val2] = this.getDrives(sourcePath, destPath);
        return destPath.replace(val2, val1);
    }
    static getDrives(...paths) {
        const rx = new RegExp('^[a-zA-Z]:');
        return paths.map(x => (rx.exec(x) || [])[0]);
    }
    static combine(array1, array2) {
        return array1.reduce((previous, current) => previous.concat(array2.map(value => [current, value].join('.'))), []);
    }
    static updateFile(filePath, replaceFn) {
        return new Promise((res, rej) => {
            fs.readFile(filePath, 'utf8', (error, raw) => {
                if (error) {
                    return rej(error);
                }
                const lineBreak = /\r\n$/.test(raw) ? '\r\n' : '\n';
                const allLines = raw.split(lineBreak);
                const data = replaceFn(allLines).join(lineBreak);
                fs.writeFile(filePath, data, (err) => {
                    if (err) {
                        return rej(err);
                    }
                    res();
                });
            });
        });
    }
    static unflattenProperties(obj, lookupKey) {
        const newObj = {};
        Reflect.ownKeys(obj).forEach((key) => lodash_1.set(newObj, key, obj[key][lookupKey]));
        return newObj;
    }
    static open(target, options) {
        return opn(target, options);
    }
}
exports.Utils = Utils;
