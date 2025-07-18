"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlomoExporter = void 0;
const playwright = __importStar(require("playwright"));
const const_1 = require("./const");
class FlomoExporter {
    async export() {
        try {
            // Setup
            const browser = await playwright.chromium.launch();
            const context = await browser.newContext({ storageState: const_1.AUTH_FILE });
            const page = await context.newPage();
            const downloadPromise = page.waitForEvent('download', { timeout: 10 * 60 * 1000 });
            await page.goto('https://v.flomoapp.com/mine?source=export');
            await page.getByRole('button', { name: '开始导出' }).click();
            const download = await downloadPromise;
            await download.saveAs(const_1.DOWNLOAD_FILE);
            // Teardown
            await context.close();
            await browser.close();
            return [true, ""];
        }
        catch (error) {
            console.log(error);
            return [false, error];
        }
    }
}
exports.FlomoExporter = FlomoExporter;
