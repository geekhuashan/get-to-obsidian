import * as path from 'path';
import * as os from 'os';
import *  as fs from 'fs-extra';
import * as playwright from 'playwright';

import { AUTH_FILE, GET_PLAYWRIGHT_CACHE_LOC, GET_LOGIN_URL } from './const'
import { LegacyExportError, toLegacyUserMessage } from './legacy_errors';
import { legacyError, legacyLog, legacyWarn } from './legacy_logger';

export class GetAuth {

    constructor() {
        fs.mkdirpSync(GET_PLAYWRIGHT_CACHE_LOC);
    }

    // Step 1: 请求发送短信验证码
    async requestSmsCode(phone: string): Promise<[boolean, string, playwright.Browser?, playwright.BrowserContext?, playwright.Page?]> {
        let browser: playwright.Browser | undefined;
        try {
            browser = await playwright.chromium.launch({ headless: false });
            const context = await browser.newContext(playwright.devices['Desktop Chrome']);
            const page = await context.newPage();

            legacyLog('login page open');
            await page.goto(GET_LOGIN_URL);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            legacyLog('login page ready');

            const phoneInput = page.getByPlaceholder('请输入手机号');
            await phoneInput.waitFor({ state: 'visible', timeout: 15000 });
            await phoneInput.fill(phone);
            await page.waitForTimeout(1000);
            legacyLog('login phone filled');

            return [true, "Please click the verification code button in the browser manually", browser, context, page];
        } catch (error: any) {
            legacyError('login request sms failed', error?.message || error);
            if (browser) {
                try {
                    await browser.close();
                } catch (e) {}
            }
            return [false, toLegacyUserMessage(new LegacyExportError("LOGIN_FAILED", error?.message || String(error)))];
        }
    }

    // Step 2: 等待用户手动输入验证码并登录，然后保存认证状态
    async waitForManualLogin(
        browser: playwright.Browser,
        context: playwright.BrowserContext,
        page: playwright.Page
    ): Promise<[boolean, string]> {
        try {
            legacyLog('login wait for manual completion');

            await page.waitForTimeout(10000);

            try {
                await page.waitForURL('**/note**', { timeout: 30000 });
                legacyLog('login url detected', page.url());
            } catch (e: any) {
                legacyWarn('login url not detected', e?.message || e);
            }

            if (await page.getByPlaceholder('请输入手机号').isVisible().catch(() => false)) {
                throw new LegacyExportError("LOGIN_FAILED", "Phone input still visible after waiting for login");
            }

            await page.context().storageState({ path: AUTH_FILE });
            legacyLog('login storage state saved', AUTH_FILE);

            await context.close();
            await browser.close();

            return [true, ""];
        } catch (error: any) {
            legacyError('login completion failed', error?.message || error);
            try {
                await browser.close();
            } catch (e) { }
            return [false, toLegacyUserMessage(error)];
        }
    }

    // 兼容旧的 auth 方法（保持接口兼容）
    // 但 Get笔记 不支持密码登录，这个方法会抛出错误
    async auth(uid: string, passwd: string): Promise<[boolean, string]> {
        return [false, "Get笔记 only supports SMS verification code login. Please use requestSmsCode() and completeAuth() instead."];
    }

}
