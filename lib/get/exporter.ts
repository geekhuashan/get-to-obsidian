import * as playwright from 'playwright';
import * as fs from 'fs-extra';
import * as https from 'https';
import * as http from 'http';

import { DOWNLOAD_FILE, AUTH_FILE, GET_EXPORT_CANDIDATE_URLS, GET_PLAYWRIGHT_CACHE_LOC } from './const'
import { LegacyExportError, toLegacyUserMessage } from './legacy_errors';
import { legacyError, legacyLog, legacyWarn } from './legacy_logger';

type ExportTask = {
    id?: string;
    access_url?: string;
    status?: string;
    finished?: boolean;
    result?: {
        percent?: number;
        success?: number;
        failed?: number;
        pending?: number;
    };
};

export class GetExporter {
    async export(): Promise<[boolean, string]> {
        let browser = null;
        try {
            await fs.mkdirp(GET_PLAYWRIGHT_CACHE_LOC);
            if (!await fs.pathExists(AUTH_FILE)) {
                throw new LegacyExportError("LOGIN_REQUIRED", "Missing auth file");
            }
            await fs.remove(DOWNLOAD_FILE).catch(() => undefined);

            browser = await playwright.chromium.launch({ headless: true });
            const context = await browser.newContext({ storageState: AUTH_FILE, acceptDownloads: true });
            const page = await context.newPage();

            legacyLog('export start');
            await this.openExportPage(page);
            await page.waitForLoadState('load');
            await page.waitForTimeout(1500);
            legacyLog('export page ready', { url: page.url(), title: await page.title() });

            try {
                const screenshotPath = DOWNLOAD_FILE.replace('get_export.zip', 'page_screenshot.png');
                await page.screenshot({ path: screenshotPath, fullPage: true });
                legacyLog('export screenshot saved', screenshotPath);
            } catch (e: any) {
                legacyWarn('export screenshot failed', e?.message || e);
            }

            const exportButton = await this.findExportButton(page);
            await exportButton.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
            legacyLog('export button found');

            const createResponsePromise = page.waitForResponse(
                (response) => response.url().includes('/sync/export/create') && response.request().method() === 'POST',
                { timeout: 30000 }
            );
            await exportButton.click({ timeout: 5000 });
            legacyLog('export task triggered');

            const createResponse = await createResponsePromise;
            const createPayload = await createResponse.json().catch(() => null) as any;
            const taskId = String(createPayload?.c?.data?.id || '');
            if (!taskId) {
                throw new LegacyExportError("DOWNLOAD_TIMEOUT", "Export task id was not returned");
            }

            const task = await this.waitForExportTask(page, taskId);
            if (task?.access_url) {
                await this.downloadFromUrl(task.access_url, DOWNLOAD_FILE);
            } else {
                await this.downloadLatestExport(page);
            }
            if (!await fs.pathExists(DOWNLOAD_FILE)) {
                throw new LegacyExportError("ZIP_NOT_FOUND", "Download file missing after legacy download step");
            }
            legacyLog('download completed', DOWNLOAD_FILE);

            await context.close();
            await browser.close();

            return [true, ""]
        } catch (error: any) {
            legacyError('export failed', error?.message || error);

            if (browser) {
                try {
                    await browser.close();
                } catch (e: any) {
                    legacyWarn('browser close failed', e?.message || e);
                }
            }

            return [false, toLegacyUserMessage(error)];
        }
    }

    private async openExportPage(page: playwright.Page): Promise<void> {
        let lastError: unknown = null;

        for (const candidate of GET_EXPORT_CANDIDATE_URLS) {
            try {
                legacyLog('open export page', candidate);
                await page.goto(candidate, { waitUntil: 'domcontentloaded', timeout: 30000 });
                await page.waitForTimeout(1000);

                if (await this.isLoginRequired(page)) {
                    throw new LegacyExportError("LOGIN_REQUIRED", `Login required at ${candidate}`);
                }

                if (await this.looksLikeExportHostPage(page)) {
                    return;
                }
            } catch (error) {
                lastError = error;
                legacyWarn('open export page candidate failed', { candidate, error: error instanceof Error ? error.message : String(error) });
                if (error instanceof LegacyExportError && error.type === "LOGIN_REQUIRED") {
                    throw error;
                }
            }
        }

        throw new LegacyExportError(
            "EXPORT_PAGE_NOT_FOUND",
            lastError instanceof Error ? lastError.message : "Could not locate legacy export page"
        );
    }

    private async isLoginRequired(page: playwright.Page): Promise<boolean> {
        const phoneInput = page.getByPlaceholder('请输入手机号');
        if (await phoneInput.count().catch(() => 0)) {
            return true;
        }

        const loginText = page.locator('text=登录, text=验证码, text=手机号').first();
        return await loginText.isVisible().catch(() => false);
    }

    private async looksLikeExportHostPage(page: playwright.Page): Promise<boolean> {
        const pageText = await page.locator('body').innerText().catch(() => '');
        return /导出笔记|点击导出|下载文件|同步|笔记|导入/.test(pageText);
    }

    private async findExportButton(page: playwright.Page): Promise<playwright.Locator> {
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
            } catch (error) {
                legacyWarn('export selector miss', selector);
            }
        }

        throw new LegacyExportError("EXPORT_BUTTON_NOT_FOUND", "Could not locate legacy export button");
    }

    private async waitForExportTask(page: playwright.Page, taskId: string): Promise<ExportTask | null> {
        legacyLog('export task poll start', taskId);
        const startedAt = Date.now();
        let completedWithoutUrlCount = 0;

        while (Date.now() - startedAt < 5 * 60 * 1000) {
            const response = await page.waitForResponse(
                (candidate) => candidate.url().includes(`/sync/export/tasks/${taskId}`) && candidate.status() === 200,
                { timeout: 35000 }
            );
            const payload = await response.json().catch(() => null) as any;
            const task = (payload?.c || {}) as ExportTask;
            legacyLog('export task poll', {
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
                    legacyWarn('export task reached 100% without access_url; using page download fallback');
                    return null;
                }
            } else {
                completedWithoutUrlCount = 0;
            }

            await page.waitForTimeout(3000);
        }

        throw new LegacyExportError("DOWNLOAD_TIMEOUT", `Export task ${taskId} did not finish in time`);
    }

    private async downloadLatestExport(page: playwright.Page): Promise<void> {
        legacyLog('download latest export fallback start');
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
            } catch (error) {
                legacyWarn('download latest export click miss');
            }
        }

        if (!clicked) {
            clicked = await page.evaluate(() => {
                const nodes = Array.from(document.querySelectorAll('*'));
                const target = nodes.find((node) => (node.textContent || '').trim() === '下载文件') as HTMLElement | undefined;
                if (!target) return false;
                target.click();
                return true;
            }).catch(() => false);
        }

        if (!clicked) {
            throw new LegacyExportError("ZIP_NOT_FOUND", "Could not click the latest export download control");
        }

        const download = await downloadPromise;
        if (!download) {
            throw new LegacyExportError("DOWNLOAD_TIMEOUT", "Download event did not fire from the latest export control");
        }
        await download.saveAs(DOWNLOAD_FILE);
    }

    private async downloadFromUrl(url: string, filePath: string): Promise<void> {
        legacyLog('download url fetch start');

        await new Promise<void>((resolve, reject) => {
            const client = url.startsWith('https:') ? https : http;
            const request = client.get(url, (response) => {
                if (response.statusCode && response.statusCode >= 400) {
                    reject(new LegacyExportError("ZIP_NOT_FOUND", `Download URL returned ${response.statusCode}`));
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
