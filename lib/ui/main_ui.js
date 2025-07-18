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
exports.MainUI = void 0;
const obsidian_1 = require("obsidian");
const common_1 = require("./common");
const auth_ui_1 = require("./auth_ui");
const importer_1 = require("../flomo/importer");
const exporter_1 = require("../flomo/exporter");
const fs = __importStar(require("fs-extra"));
const const_1 = require("../flomo/const");
class MainUI extends obsidian_1.Modal {
    plugin;
    rawPath;
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.rawPath = "";
    }
    async onSync(btn) {
        const isAuthFileExist = await fs.exists(const_1.AUTH_FILE);
        try {
            if (isAuthFileExist) {
                btn.setDisabled(true);
                btn.setButtonText("Exporting from Flomo ...");
                const exportResult = await (new exporter_1.FlomoExporter().export());
                btn.setDisabled(false);
                if (exportResult[0] == true) {
                    this.rawPath = const_1.DOWNLOAD_FILE;
                    btn.setButtonText("Importing...");
                    await this.onSubmit();
                    btn.setButtonText("Auto Sync 🤗");
                }
                else {
                    throw new Error(exportResult[1]);
                }
            }
            else {
                const authUI = new auth_ui_1.AuthUI(this.app, this.plugin);
                authUI.open();
            }
        }
        catch (err) {
            console.log(err);
            btn.setButtonText("Auto Sync 🤗");
            new obsidian_1.Notice(`Flomo Sync Error. Details:\n${err}`);
        }
    }
    async onSubmit() {
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
            const flomo = await (new importer_1.FlomoImporter(this.app, config)).import();
            // 保存新同步的备忘录ID
            if (flomo.syncedMemoIds && flomo.syncedMemoIds.length > 0) {
                this.plugin.settings.syncedMemoIds = flomo.syncedMemoIds;
                await this.plugin.saveSettings();
            }
            new obsidian_1.Notice(`🎉 Import Completed.\nTotal: ${flomo.memos.length} memos, New: ${flomo.newMemosCount || 0} memos`);
            this.rawPath = "";
        }
        catch (err) {
            this.rawPath = "";
            console.log(err);
            new obsidian_1.Notice(`Flomo Importer Error. Details:\n${err}`);
        }
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Flomo Importer" });
        const fileLocContol = contentEl.createEl("input", { type: "file", cls: "uploadbox" });
        fileLocContol.setAttr("accept", ".zip");
        fileLocContol.onchange = (ev) => {
            this.rawPath = ev.currentTarget.files[0]["path"];
            console.log(this.rawPath);
        };
        contentEl.createEl("br");
        new obsidian_1.Setting(contentEl)
            .setName('Flomo Home')
            .setDesc('set the flomo home location')
            .addText(text => text
            .setPlaceholder('flomo')
            .setValue(this.plugin.settings.flomoTarget)
            .onChange(async (value) => {
            this.plugin.settings.flomoTarget = value;
        }));
        new obsidian_1.Setting(contentEl)
            .setName('Memo Home')
            .setDesc('your memos are at: FlomoHome / MemoHome')
            .addText((text) => text
            .setPlaceholder('memos')
            .setValue(this.plugin.settings.memoTarget)
            .onChange(async (value) => {
            this.plugin.settings.memoTarget = value;
        }));
        new obsidian_1.Setting(contentEl)
            .setName('Moments')
            .setDesc('set moments style: flow(default) | skip')
            .addDropdown((drp) => {
            drp.addOption("copy_with_link", "Generate Moments")
                .addOption("skip", "Skip Moments")
                .setValue(this.plugin.settings.optionsMoments)
                .onChange(async (value) => {
                this.plugin.settings.optionsMoments = value;
            });
        });
        new obsidian_1.Setting(contentEl)
            .setName('Canvas')
            .setDesc('set canvas options: link | content(default) | skip')
            .addDropdown((drp) => {
            drp.addOption("copy_with_link", "Generate Canvas")
                .addOption("copy_with_content", "Generate Canvas (with content)")
                .addOption("skip", "Skip Canvas")
                .setValue(this.plugin.settings.optionsCanvas)
                .onChange(async (value) => {
                this.plugin.settings.optionsCanvas = value;
            });
        });
        const canvsOptionBlock = contentEl.createEl("div", { cls: "canvasOptionBlock" });
        const canvsOptionLabelL = canvsOptionBlock.createEl("label");
        const canvsOptionLabelM = canvsOptionBlock.createEl("label");
        const canvsOptionLabelS = canvsOptionBlock.createEl("label");
        const canvsSizeL = canvsOptionLabelL.createEl("input", { type: "radio", cls: "ckbox" });
        canvsOptionLabelL.createEl("small", { text: "large" });
        const canvsSizeM = canvsOptionLabelM.createEl("input", { type: "radio", cls: "ckbox" });
        canvsOptionLabelM.createEl("small", { text: "medium" });
        const canvsSizeS = canvsOptionLabelS.createEl("input", { type: "radio", cls: "ckbox" });
        canvsOptionLabelS.createEl("small", { text: "small" });
        canvsSizeL.name = "canvas_opt";
        canvsSizeM.name = "canvas_opt";
        canvsSizeS.name = "canvas_opt";
        switch (this.plugin.settings.canvasSize) {
            case "L":
                canvsSizeL.checked = true;
                break;
            case "M":
                canvsSizeM.checked = true;
                break;
            case "S":
                canvsSizeS.checked = true;
                break;
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
        new obsidian_1.Setting(contentEl).setName('Experimental Options').setDesc('set experimental options');
        const allowBiLink = (0, common_1.createExpOpt)(contentEl, "Convert bidirectonal link. example: [[abc]]");
        allowBiLink.checked = this.plugin.settings.expOptionAllowbilink;
        allowBiLink.onchange = (ev) => {
            this.plugin.settings.expOptionAllowbilink = ev.currentTarget.checked;
        };
        const mergeByDate = (0, common_1.createExpOpt)(contentEl, "Merge memos by date");
        mergeByDate.checked = this.plugin.settings.mergeByDate;
        mergeByDate.onchange = (ev) => {
            this.plugin.settings.mergeByDate = ev.currentTarget.checked;
        };
        new obsidian_1.Setting(contentEl).setName('Auto Sync Options').setDesc('set auto sync options');
        const autoSyncOnStartup = (0, common_1.createExpOpt)(contentEl, "Auto sync when Obsidian starts");
        autoSyncOnStartup.checked = this.plugin.settings.autoSyncOnStartup;
        autoSyncOnStartup.onchange = (ev) => {
            this.plugin.settings.autoSyncOnStartup = ev.currentTarget.checked;
        };
        const autoSyncInterval = (0, common_1.createExpOpt)(contentEl, "Auto sync every hour");
        autoSyncInterval.checked = this.plugin.settings.autoSyncInterval;
        autoSyncInterval.onchange = (ev) => {
            this.plugin.settings.autoSyncInterval = ev.currentTarget.checked;
            if (ev.currentTarget.checked) {
                // 如果启用了每小时同步，立即开始定时任务
                this.plugin.startAutoSync();
            }
            else {
                // 如果禁用了每小时同步，停止定时任务
                this.plugin.stopAutoSync();
            }
        };
        // 显示上次同步时间
        if (this.plugin.settings.lastSyncTime) {
            const lastSyncDate = new Date(this.plugin.settings.lastSyncTime);
            contentEl.createEl("div", {
                text: `Last sync: ${lastSyncDate.toLocaleString()}`,
                cls: "last-sync-time"
            });
        }
        new obsidian_1.Setting(contentEl)
            .addButton((btn) => {
            btn.setButtonText("Cancel")
                .setCta()
                .onClick(async () => {
                await this.plugin.saveSettings();
                this.close();
            });
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
                    new obsidian_1.Notice("No File Selected.");
                }
            });
        })
            .addButton((btn) => {
            btn.setButtonText("Auto Sync 🤗")
                .setCta()
                .onClick(async () => {
                await this.plugin.saveSettings();
                await this.onSync(btn);
                //this.close();
            });
        });
    }
    onClose() {
        this.rawPath = "";
        const { contentEl } = this;
        contentEl.empty();
    }
}
exports.MainUI = MainUI;
