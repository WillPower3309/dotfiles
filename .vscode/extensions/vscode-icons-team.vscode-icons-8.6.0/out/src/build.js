"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iconsGenerator_1 = require("./iconsManifest/iconsGenerator");
const iconsGenerator = new iconsGenerator_1.IconsGenerator();
const iconsManifest = iconsGenerator.generateIconsManifest();
iconsGenerator.persist(iconsManifest, /*updatePackageJson*/ true);
