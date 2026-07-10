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
exports.GetExporter = void 0;
const playwright = __importStar(require("playwright"));
const fs = __importStar(require("fs-extra"));
const https = __importStar(require("https"));
const http = __importStar(require("http"));
const const_1 = require("./const");
const legacy_errors_1 = require("./legacy_errors");
const legacy_logger_1 = require("./legacy_logger");
class GetExporter {
    async export() {
        let browser = null;
        try {
            await fs.mkdirp(const_1.GET_PLAYWRIGHT_CACHE_LOC);
            if (!await fs.pathExists(const_1.AUTH_FILE)) {
                throw new legacy_errors_1.LegacyExportError("LOGIN_REQUIRED", "Missing auth file");
            }
            await fs.remove(const_1.DOWNLOAD_FILE).catch(() => undefined);
            browser = await playwright.chromium.launch({ headless: true });
            const context = await browser.newContext({ storageState: const_1.AUTH_FILE, acceptDownloads: true });
            const page = await context.newPage();
            (0, legacy_logger_1.legacyLog)('export start');
            await this.openExportPage(page);
            await page.waitForLoadState('load');
            await page.waitForTimeout(1500);
            (0, legacy_logger_1.legacyLog)('export page ready', { url: page.url(), title: await page.title() });
            try {
                const screenshotPath = const_1.DOWNLOAD_FILE.replace('get_export.zip', 'page_screenshot.png');
                await page.screenshot({ path: screenshotPath, fullPage: true });
                (0, legacy_logger_1.legacyLog)('export screenshot saved', screenshotPath);
            }
            catch (e) {
                (0, legacy_logger_1.legacyWarn)('export screenshot failed', e?.message || e);
            }
            const exportButton = await this.findExportButton(page);
            await exportButton.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
            (0, legacy_logger_1.legacyLog)('export button found');
            const createResponsePromise = page.waitForResponse((response) => response.url().includes('/sync/export/create') && response.request().method() === 'POST', { timeout: 30000 });
            await exportButton.click({ timeout: 5000 });
            (0, legacy_logger_1.legacyLog)('export task triggered');
            const createResponse = await createResponsePromise;
            const createPayload = await createResponse.json().catch(() => null);
            const taskId = String(createPayload?.c?.data?.id || '');
            if (!taskId) {
                throw new legacy_errors_1.LegacyExportError("DOWNLOAD_TIMEOUT", "Export task id was not returned");
            }
            const task = await this.waitForExportTask(page, taskId);
            if (task?.access_url) {
                await this.downloadFromUrl(task.access_url, const_1.DOWNLOAD_FILE);
            }
            else {
                await this.downloadLatestExport(page);
            }
            if (!await fs.pathExists(const_1.DOWNLOAD_FILE)) {
                throw new legacy_errors_1.LegacyExportError("ZIP_NOT_FOUND", "Download file missing after legacy download step");
            }
            (0, legacy_logger_1.legacyLog)('download completed', const_1.DOWNLOAD_FILE);
            await context.close();
            await browser.close();
            return [true, ""];
        }
        catch (error) {
            (0, legacy_logger_1.legacyError)('export failed', error?.message || error);
            if (browser) {
                try {
                    await browser.close();
                }
                catch (e) {
                    (0, legacy_logger_1.legacyWarn)('browser close failed', e?.message || e);
                }
            }
            return [false, (0, legacy_errors_1.toLegacyUserMessage)(error)];
        }
    }
    async openExportPage(page) {
        let lastError = null;
        for (const candidate of const_1.GET_EXPORT_CANDIDATE_URLS) {
            try {
                (0, legacy_logger_1.legacyLog)('open export page', candidate);
                await page.goto(candidate, { waitUntil: 'domcontentloaded', timeout: 30000 });
                await page.waitForTimeout(1000);
                if (await this.isLoginRequired(page)) {
                    throw new legacy_errors_1.LegacyExportError("LOGIN_REQUIRED", `Login required at ${candidate}`);
                }
                if (await this.looksLikeExportHostPage(page)) {
                    return;
                }
            }
            catch (error) {
                lastError = error;
                (0, legacy_logger_1.legacyWarn)('open export page candidate failed', { candidate, error: error instanceof Error ? error.message : String(error) });
                if (error instanceof legacy_errors_1.LegacyExportError && error.type === "LOGIN_REQUIRED") {
                    throw error;
                }
            }
        }
        throw new legacy_errors_1.LegacyExportError("EXPORT_PAGE_NOT_FOUND", lastError instanceof Error ? lastError.message : "Could not locate legacy export page");
    }
    async isLoginRequired(page) {
        const phoneInput = page.getByPlaceholder('请输入手机号');
        if (await phoneInput.count().catch(() => 0)) {
            return true;
        }
        const loginText = page.locator('text=登录, text=验证码, text=手机号').first();
        return await loginText.isVisible().catch(() => false);
    }
    async looksLikeExportHostPage(page) {
        const pageText = await page.locator('body').innerText().catch(() => '');
        return /导出笔记|点击导出|下载文件|同步|笔记|导入/.test(pageText);
    }
    async findExportButton(page) {
        const selectors = [
            'button:has-text("点击导出")',
            'span:has-text("点击导出")',
            'button:has-text("导出")',
            'button:has-text("下载")',
            'button:has-text("备份")',
            'a:has-text("导出")',
            'a:has-text("下载")',
            '[role="button"]:has-text("导出")',
            '[role="button"]:has-text("下载")',
            '[class*="export"]',
            '[class*="download"]'
        ];
        for (const selector of selectors) {
            const locator = page.locator(selector).first();
            try {
                await locator.waitFor({ state: 'visible', timeout: 3000 });
                return locator;
            }
            catch (error) {
                (0, legacy_logger_1.legacyWarn)('export selector miss', selector);
            }
        }
        throw new legacy_errors_1.LegacyExportError("EXPORT_BUTTON_NOT_FOUND", "Could not locate legacy export button");
    }
    async waitForExportTask(page, taskId) {
        (0, legacy_logger_1.legacyLog)('export task poll start', taskId);
        const startedAt = Date.now();
        let completedWithoutUrlCount = 0;
        while (Date.now() - startedAt < 5 * 60 * 1000) {
            const response = await page.waitForResponse((candidate) => candidate.url().includes(`/sync/export/tasks/${taskId}`) && candidate.status() === 200, { timeout: 35000 });
            const payload = await response.json().catch(() => null);
            const task = (payload?.c || {});
            (0, legacy_logger_1.legacyLog)('export task poll', {
                taskId,
                status: task.status,
                finished: task.finished,
                percent: task.result?.percent,
                hasAccessUrl: Boolean(task.access_url)
            });
            if (task.access_url) {
                return task;
            }
            if (task.result?.percent === 1) {
                completedWithoutUrlCount += 1;
                if (completedWithoutUrlCount >= 5) {
                    (0, legacy_logger_1.legacyWarn)('export task reached 100% without access_url; using page download fallback');
                    return null;
                }
            }
            else {
                completedWithoutUrlCount = 0;
            }
            await page.waitForTimeout(3000);
        }
        throw new legacy_errors_1.LegacyExportError("DOWNLOAD_TIMEOUT", `Export task ${taskId} did not finish in time`);
    }
    async downloadLatestExport(page) {
        (0, legacy_logger_1.legacyLog)('download latest export fallback start');
        const downloadPromise = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);
        const candidates = [
            page.getByText('下载文件', { exact: true }),
            page.locator('.download-tip').first()
        ];
        let clicked = false;
        for (const candidate of candidates) {
            try {
                await candidate.click({ timeout: 5000, force: true });
                clicked = true;
                break;
            }
            catch (error) {
                (0, legacy_logger_1.legacyWarn)('download latest export click miss');
            }
        }
        if (!clicked) {
            clicked = await page.evaluate(() => {
                const nodes = Array.from(document.querySelectorAll('*'));
                const target = nodes.find((node) => (node.textContent || '').trim() === '下载文件');
                if (!target)
                    return false;
                target.click();
                return true;
            }).catch(() => false);
        }
        if (!clicked) {
            throw new legacy_errors_1.LegacyExportError("ZIP_NOT_FOUND", "Could not click the latest export download control");
        }
        const download = await downloadPromise;
        if (!download) {
            throw new legacy_errors_1.LegacyExportError("DOWNLOAD_TIMEOUT", "Download event did not fire from the latest export control");
        }
        await download.saveAs(const_1.DOWNLOAD_FILE);
    }
    async downloadFromUrl(url, filePath) {
        (0, legacy_logger_1.legacyLog)('download url fetch start');
        await new Promise((resolve, reject) => {
            const client = url.startsWith('https:') ? https : http;
            const request = client.get(url, (response) => {
                if (response.statusCode && response.statusCode >= 400) {
                    reject(new legacy_errors_1.LegacyExportError("ZIP_NOT_FOUND", `Download URL returned ${response.statusCode}`));
                    return;
                }
                const stream = fs.createWriteStream(filePath);
                response.pipe(stream);
                stream.on('finish', () => {
                    stream.close();
                    resolve();
                });
                stream.on('error', reject);
            });
            request.on('error', reject);
        });
    }
}
exports.GetExporter = GetExporter;
