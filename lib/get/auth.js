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
exports.GetAuth = void 0;
const fs = __importStar(require("fs-extra"));
const playwright = __importStar(require("playwright"));
const const_1 = require("./const");
const legacy_errors_1 = require("./legacy_errors");
const legacy_logger_1 = require("./legacy_logger");
class GetAuth {
    constructor() {
        fs.mkdirpSync(const_1.GET_PLAYWRIGHT_CACHE_LOC);
    }
    // Step 1: 请求发送短信验证码
    async requestSmsCode(phone) {
        let browser;
        try {
            browser = await playwright.chromium.launch({ headless: false });
            const context = await browser.newContext(playwright.devices['Desktop Chrome']);
            const page = await context.newPage();
            (0, legacy_logger_1.legacyLog)('login page open');
            await page.goto(const_1.GET_LOGIN_URL);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            (0, legacy_logger_1.legacyLog)('login page ready');
            const phoneInput = page.getByPlaceholder('请输入手机号');
            await phoneInput.waitFor({ state: 'visible', timeout: 15000 });
            await phoneInput.fill(phone);
            await page.waitForTimeout(1000);
            (0, legacy_logger_1.legacyLog)('login phone filled');
            return [true, "Please click the verification code button in the browser manually", browser, context, page];
        }
        catch (error) {
            (0, legacy_logger_1.legacyError)('login request sms failed', error?.message || error);
            if (browser) {
                try {
                    await browser.close();
                }
                catch (e) { }
            }
            return [false, (0, legacy_errors_1.toLegacyUserMessage)(new legacy_errors_1.LegacyExportError("LOGIN_FAILED", error?.message || String(error)))];
        }
    }
    // Step 2: 等待用户手动输入验证码并登录，然后保存认证状态
    async waitForManualLogin(browser, context, page) {
        try {
            (0, legacy_logger_1.legacyLog)('login wait for manual completion');
            await page.waitForTimeout(10000);
            try {
                await page.waitForURL('**/note**', { timeout: 30000 });
                (0, legacy_logger_1.legacyLog)('login url detected', page.url());
            }
            catch (e) {
                (0, legacy_logger_1.legacyWarn)('login url not detected', e?.message || e);
            }
            if (await page.getByPlaceholder('请输入手机号').isVisible().catch(() => false)) {
                throw new legacy_errors_1.LegacyExportError("LOGIN_FAILED", "Phone input still visible after waiting for login");
            }
            await page.context().storageState({ path: const_1.AUTH_FILE });
            (0, legacy_logger_1.legacyLog)('login storage state saved', const_1.AUTH_FILE);
            await context.close();
            await browser.close();
            return [true, ""];
        }
        catch (error) {
            (0, legacy_logger_1.legacyError)('login completion failed', error?.message || error);
            try {
                await browser.close();
            }
            catch (e) { }
            return [false, (0, legacy_errors_1.toLegacyUserMessage)(error)];
        }
    }
    // 兼容旧的 auth 方法（保持接口兼容）
    // 但 Get笔记 不支持密码登录，这个方法会抛出错误
    async auth(uid, passwd) {
        return [false, "Get笔记 only supports SMS verification code login. Please use requestSmsCode() and completeAuth() instead."];
    }
}
exports.GetAuth = GetAuth;
