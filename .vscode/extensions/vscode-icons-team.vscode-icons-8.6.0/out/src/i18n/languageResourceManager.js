"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../models");
const constants_1 = require("../constants");
const langResourceCollection_1 = require("../i18n/langResourceCollection");
class LanguageResourceManager {
    constructor(languageResource) {
        this.languageResource = languageResource;
        this.languageResource =
            this.languageResource && Reflect.ownKeys(this.languageResource).length
                ? this.languageResource
                : langResourceCollection_1.langResourceCollection.en;
    }
    getMessage(...keys) {
        let msg = '';
        keys.forEach(key => {
            // If key is of type 'number' it's a LangResourceKeys
            const stringifiedKey = typeof key === 'number' ? models.LangResourceKeys[key] : key;
            if (typeof key === 'number') {
                if (Reflect.has(this.languageResource, stringifiedKey)) {
                    // If no message is found fallback to english message
                    let message = this.languageResource[stringifiedKey] ||
                        langResourceCollection_1.langResourceCollection.en[stringifiedKey];
                    // If not a string then it's of type IOSSpecific
                    if (typeof message !== 'string') {
                        if (Reflect.has(message, process.platform)) {
                            message = message[process.platform];
                        }
                        else {
                            throw new Error(`Not Implemented: ${process.platform}`);
                        }
                    }
                    msg += message;
                    return;
                }
                throw new Error(`${stringifiedKey} is not valid`);
            }
            stringifiedKey.split('').forEach(char => {
                if (char.match(/[#^*|\\/{}+=]/g)) {
                    throw new Error(`${char} is not valid`);
                }
                msg += char;
                return;
            });
        });
        return msg.replace(/%extensionName%/gi, constants_1.constants.extension.name).trim();
    }
    getLangResourceKey(message) {
        if (!message) {
            return undefined;
        }
        const prop = Reflect.ownKeys(this.languageResource).find(key => this.languageResource[key] === message);
        return models.LangResourceKeys[prop];
    }
}
exports.LanguageResourceManager = LanguageResourceManager;
