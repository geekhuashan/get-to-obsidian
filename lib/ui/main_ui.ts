import { App, Modal, Plugin, Setting, Notice, ButtonComponent,  } from 'obsidian';

import { createExpOpt } from './common';
import { AuthUI } from './auth_ui';
import { FlomoImporter } from '../flomo/importer';
import { FlomoExporter } from '../flomo/exporter';
import type FlomoImporterPlugin from '../../main';

import * as path from 'path';
import * as os from 'os';
import *  as fs from 'fs-extra';

import { AUTH_FILE, DOWNLOAD_FILE } from '../flomo/const'

export class MainUI extends Modal {

    plugin: FlomoImporterPlugin;
    rawPath: string;

    constructor(app: App, plugin: FlomoImporterPlugin) {
        super(app);
        this.plugin = plugin;
        this.rawPath = "";
    }

    async onSync(btn: ButtonComponent): Promise<void> {
        const isAuthFileExist = await fs.exists(AUTH_FILE)
        try {
            if (isAuthFileExist) {
                btn.setDisabled(true);
                btn.setButtonText("Exporting from Flomo ...");
                const exportResult = await (new FlomoExporter().export());
                
                btn.setDisabled(false);
                if (exportResult[0] == true) {
                    this.rawPath = DOWNLOAD_FILE;
                    btn.setButtonText("Importing...");
                    await this.onSubmit();
                    btn.setButtonText("Auto Sync 🤗");
                } else {
                    throw new Error(exportResult[1]);
                }
            } else {
                const authUI: Modal = new AuthUI(this.app, this.plugin);
                authUI.open();
            }
        } catch (err) {
            console.log(err);
            btn.setButtonText("Auto Sync 🤗");
            new Notice(`Flomo Sync Error. Details:\n${err}`);
        }
    }

    async onSubmit(): Promise<void> {
        const targetMemoLocation = this.plugin.settings.flomoTarget + "/" +
            this.plugin.settings.memoTarget;

        const res = await this.app.vault.adapter.exists(targetMemoLocation);
        if (!res) {
            console.debug(`DEBUG: creating memo root -> ${targetMemoLocation}`);
            await this.app.vault.adapter.mkdir(`${targetMemoLocation}`);
        }

        try {
            const config = this.plugin.settings;
            config["rawDir"] = this.rawPath;

            // 将已同步的备忘录ID传递给导入器，用于增量同步
            config["syncedMemoIds"] = this.plugin.settings.syncedMemoIds || [];

            const flomo = await (new FlomoImporter(this.app, config)).import();

            // 保存新同步的备忘录ID
            if (flomo.syncedMemoIds && flomo.syncedMemoIds.length > 0) {
                this.plugin.settings.syncedMemoIds = flomo.syncedMemoIds;
                await this.plugin.saveSettings();
            }

            new Notice(`🎉 Import Completed.\nTotal: ${flomo.memos.length} memos, New: ${flomo.newMemosCount || 0} memos`)
            this.rawPath = "";


        } catch (err) {
            this.rawPath = "";
            console.log(err);
            new Notice(`Flomo Importer Error. Details:\n${err}`);
        }

    }

    onOpen() {

        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Flomo Importer" });

        const fileLocContol: HTMLInputElement = contentEl.createEl("input", { type: "file", cls: "uploadbox" })
        fileLocContol.setAttr("accept", ".zip");
        fileLocContol.onchange = (ev) => {
            this.rawPath = (ev.currentTarget as HTMLInputElement).files[0]["path"];
            console.log(this.rawPath)
        };

        contentEl.createEl("br");

        new Setting(contentEl)
            .setName('Flomo Home')
            .setDesc('set the flomo home location')
            .addText(text => text
                .setPlaceholder('flomo')
                .setValue(this.plugin.settings.flomoTarget)
                .onChange(async (value) => {
                    this.plugin.settings.flomoTarget = value;
                }));

        new Setting(contentEl)
            .setName('Memo Home')
            .setDesc('your memos are at: FlomoHome / MemoHome')
            .addText((text) => text
                .setPlaceholder('memos')
                .setValue(this.plugin.settings.memoTarget)
                .onChange(async (value) => {
                    this.plugin.settings.memoTarget = value;
                }));

        new Setting(contentEl)
            .setName('Moments')
            .setDesc('set moments style: flow(default) | skip')
            .addDropdown((drp) => {
                drp.addOption("copy_with_link", "Generate Moments")
                    .addOption("skip", "Skip Moments")
                    .setValue(this.plugin.settings.optionsMoments)
                    .onChange(async (value) => {
                        this.plugin.settings.optionsMoments = value;
                    })
            })

        new Setting(contentEl)
            .setName('Canvas')
            .setDesc('set canvas options: link | content(default) | skip')
            .addDropdown((drp) => {
                drp.addOption("copy_with_link", "Generate Canvas")
                    .addOption("copy_with_content", "Generate Canvas (with content)")
                    .addOption("skip", "Skip Canvas")
                    .setValue(this.plugin.settings.optionsCanvas)
                    .onChange(async (value) => {
                        this.plugin.settings.optionsCanvas = value;
                    })
            });

        const canvsOptionBlock: HTMLDivElement = contentEl.createEl("div", { cls: "canvasOptionBlock" });

        const canvsOptionLabelL: HTMLLabelElement = canvsOptionBlock.createEl("label");
        const canvsOptionLabelM: HTMLLabelElement = canvsOptionBlock.createEl("label");
        const canvsOptionLabelS: HTMLLabelElement = canvsOptionBlock.createEl("label");

        const canvsSizeL: HTMLInputElement = canvsOptionLabelL.createEl("input", { type: "radio", cls: "ckbox" });
        canvsOptionLabelL.createEl("small", { text: "large" });
        const canvsSizeM: HTMLInputElement = canvsOptionLabelM.createEl("input", { type: "radio", cls: "ckbox" });
        canvsOptionLabelM.createEl("small", { text: "medium" });
        const canvsSizeS: HTMLInputElement = canvsOptionLabelS.createEl("input", { type: "radio", cls: "ckbox" });
        canvsOptionLabelS.createEl("small", { text: "small" });

        canvsSizeL.name = "canvas_opt";
        canvsSizeM.name = "canvas_opt";
        canvsSizeS.name = "canvas_opt";

        switch (this.plugin.settings.canvasSize) {
            case "L":
                canvsSizeL.checked = true;
                break
            case "M":
                canvsSizeM.checked = true;
                break
            case "S":
                canvsSizeS.checked = true;
                break
        }

        canvsSizeL.onchange = (ev) => {
            this.plugin.settings.canvasSize = "L";
        };

        canvsSizeM.onchange = (ev) => {
            this.plugin.settings.canvasSize = "M";
        };

        canvsSizeS.onchange = (ev) => {
            this.plugin.settings.canvasSize = "S";
        };

        new Setting(contentEl).setName('Experimental Options').setDesc('set experimental options')

        const allowBiLink = createExpOpt(contentEl, "Convert bidirectonal link. example: [[abc]]")

        allowBiLink.checked = this.plugin.settings.expOptionAllowbilink;
        allowBiLink.onchange = (ev) => {
            this.plugin.settings.expOptionAllowbilink = (ev.currentTarget as HTMLInputElement).checked;
        };


        const mergeByDate = createExpOpt(contentEl, "Merge memos by date")

        mergeByDate.checked = this.plugin.settings.mergeByDate;
        mergeByDate.onchange = (ev) => {
            this.plugin.settings.mergeByDate = (ev.currentTarget as HTMLInputElement).checked;
        };

        new Setting(contentEl).setName('Auto Sync Options').setDesc('set auto sync options')

        const autoSyncOnStartup = createExpOpt(contentEl, "Auto sync when Obsidian starts")

        autoSyncOnStartup.checked = this.plugin.settings.autoSyncOnStartup;
        autoSyncOnStartup.onchange = (ev) => {
            this.plugin.settings.autoSyncOnStartup = (ev.currentTarget as HTMLInputElement).checked;
        };

        const autoSyncInterval = createExpOpt(contentEl, "Auto sync every hour")

        autoSyncInterval.checked = this.plugin.settings.autoSyncInterval;
        autoSyncInterval.onchange = (ev) => {
            this.plugin.settings.autoSyncInterval = (ev.currentTarget as HTMLInputElement).checked;
            if ((ev.currentTarget as HTMLInputElement).checked) {
                // 如果启用了每小时同步，立即开始定时任务
                (this.plugin as any).startAutoSync();
            } else {
                // 如果禁用了每小时同步，停止定时任务
                (this.plugin as any).stopAutoSync();
            }
        };

        // 显示上次同步时间和同步记录数
        if (this.plugin.settings.lastSyncTime) {
            const lastSyncDate = new Date(this.plugin.settings.lastSyncTime);
            const syncedCount = this.plugin.settings.syncedMemoIds?.length || 0;
            contentEl.createEl("div", {
                text: `Last sync: ${lastSyncDate.toLocaleString()}`,
                cls: "last-sync-time"
            });
            contentEl.createEl("div", {
                text: `Synced memos: ${syncedCount}`,
                cls: "synced-count"
            });
        }

        // 添加重置同步记录按钮
        new Setting(contentEl)
            .setName('Reset Sync History')
            .setDesc('Clear all synced memo IDs to re-import all memos (useful after changing attachment paths)')
            .addButton((btn) => {
                btn.setButtonText("Reset Sync History")
                    .setWarning()
                    .onClick(async () => {
                        const flomoTarget = this.plugin.settings.flomoTarget || "flomo";
                        const memoTarget = this.plugin.settings.memoTarget || "memos";
                        const confirmed = confirm(
                            `Are you sure you want to reset sync history?\n\n` +
                            `This will clear ${this.plugin.settings.syncedMemoIds?.length || 0} synced memo records.\n` +
                            `Next sync will re-import all memos from Flomo.\n\n` +
                            `⚠️  IMPORTANT: Before syncing again, you should:\n` +
                            `1. Delete the old memos folder: ${flomoTarget}/${memoTarget}/\n` +
                            `2. Delete the old attachments folder if path changed\n\n` +
                            `Otherwise, existing files will be OVERWRITTEN!`
                        );
                        if (confirmed) {
                            this.plugin.settings.syncedMemoIds = [];
                            this.plugin.settings.lastSyncTime = 0;
                            await this.plugin.saveSettings();
                            new Notice(
                                `Sync history has been reset.\n\n` +
                                `⚠️  Remember to delete old folders before next sync:\n` +
                                `- ${flomoTarget}/${memoTarget}/\n` +
                                `- ${flomoTarget}/flomo picture/ (if exists)`,
                                10000
                            );
                            this.close();
                            this.open(); // 重新打开以刷新显示
                        }
                    })
            });

        new Setting(contentEl)
            .addButton((btn) => {
                btn.setButtonText("Cancel")
                    .setCta()
                    .onClick(async () => {
                        await this.plugin.saveSettings();
                        this.close();
                    })
            })
            .addButton((btn) => {
                btn.setButtonText("Import")
                    .setCta()
                    .onClick(async () => {
                        if (this.rawPath != "") {
                            await this.plugin.saveSettings();
                            await this.onSubmit();
                            //const manualSyncUI: Modal = new ManualSyncUI(this.app, this.plugin);
                            //manualSyncUI.open();
                            this.close();
                        }
                        else {
                            new Notice("No File Selected.")
                        }
                    })
            })
            .addButton((btn) => {
                btn.setButtonText("Auto Sync 🤗")
                    .setCta()
                    .onClick(async () => {
                        await this.plugin.saveSettings();
                        await this.onSync(btn);
                        //this.close();
                    })
            });   

    }

    onClose() {
        this.rawPath = "";
        const { contentEl } = this;
        contentEl.empty();
    }
} 