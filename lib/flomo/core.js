"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlomoCore = void 0;
const node_html_parser_1 = require("node-html-parser");
//import { NodeHtmlMarkdown} from 'node-html-markdown';
const turndown_1 = __importDefault(require("turndown"));
class FlomoCore {
    memos;
    tags;
    files;
    syncedMemoIds = []; // 已同步的备忘录IDs
    newMemosCount = 0; // 新增备忘录数量
    constructor(flomoData, syncedMemoIds = []) {
        //const root = parse(DOMPurify.sanitize(flomoData));
        const root = (0, node_html_parser_1.parse)(flomoData);
        this.syncedMemoIds = [...syncedMemoIds]; // 复制已同步的备忘录IDs
        this.memos = this.loadMemos(root.querySelectorAll(".memo"));
        this.tags = this.loadTags(root.getElementById("tag").querySelectorAll("option"));
        this.files = {};
    }
    loadMemos(memoNodes) {
        const res = [];
        const extrtactTitle = (item) => { return item.replace(/(-|:|\s)/gi, "_"); };
        const extractContent = (content) => {
            //return NodeHtmlMarkdown.translate(content, {bulletMarker: '-',}).replace('\[', '[').replace('\]', ']')
            //return NodeHtmlMarkdown.translate(content, {bulletMarker: '-',}).replace('\[', '[').replace('\]', ']')
            //return (new showdown.Converter({metadata: false})).makeMarkdown(content)
            //return NodeHtmlMarkdown.translate(content, {bulletMarker: '-'})
            const td = new turndown_1.default({ bulletListMarker: '-' });
            //const p_rule = {
            //    filter: 'p',
            //    replacement: function (content) {
            //      return '\n' + content + '\n'
            //    }
            //  }
            const liRule = {
                filter: 'li',
                replacement: function (content, node, options) {
                    content = content
                        .replace(/^\n+/, '') // remove leading newlines
                        .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
                        .replace(/\n/gm, '\n    '); // indent
                    //.replace(/\<p\>/gi, '')
                    //.replace(/\<\/p\>/gi, '')
                    var prefix = options.bulletListMarker + ' ';
                    var parent = node.parentNode;
                    if (parent.nodeName === 'OL') {
                        var start = parent.getAttribute('start');
                        var index = Array.prototype.indexOf.call(parent.children, node);
                        prefix = (start ? Number(start) + index : index + 1) + '.  ';
                    }
                    return (prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : ''));
                }
            };
            td.addRule('listItem', liRule);
            return td.turndown(content).replace(/\\\[/g, '[')
                .replace(/\\\]/g, ']')
                //replace(/\\#/g, '#')
                .replace(/!\[\]\(file\//gi, "\n![](flomo/");
            //.replace(/\<\!--\s--\>/g, '')
            //.replace(/^\s*[\r\n]/gm,'')
            //.replace(/!\[null\]\(<file\//gi, "\n![](<flomo/");
        };
        // 用于记录当天每个时间戳出现的次数
        const timeOccurrences = {};
        // 记录处理的总备忘录数量，用于生成顺序ID
        let totalMemoCount = 0;
        console.debug(`开始处理 ${memoNodes.length} 条备忘录，已有 ${this.syncedMemoIds.length} 条同步记录`);
        memoNodes.forEach(i => {
            totalMemoCount++;
            const dateTime = i.querySelector(".time").textContent;
            const title = extrtactTitle(dateTime);
            // 计算当前时间戳出现的次数
            if (!timeOccurrences[dateTime]) {
                timeOccurrences[dateTime] = 0;
            }
            timeOccurrences[dateTime]++;
            const occurrenceCount = timeOccurrences[dateTime];
            // @Mar-31, 2024 Fix: #20 - Support <mark>.*?<mark/>
            const contentBody = i.querySelector(".content").innerHTML.replaceAll("<mark>", "FLOMOIMPORTERHIGHLIGHTMARKPLACEHOLDER").replaceAll("</mark>", "FLOMOIMPORTERHIGHLIGHTMARKPLACEHOLDER");
            const contentFile = i.querySelector(".files").innerHTML;
            // 改进的哈希算法：结合更多信息
            let contentHash = 0;
            // 1. 对标题进行哈希
            const titleText = title || "";
            for (let j = 0; j < titleText.length; j++) {
                contentHash = ((contentHash << 5) - contentHash) + titleText.charCodeAt(j);
                contentHash = contentHash & contentHash;
            }
            // 2. 对正文进行哈希
            for (let j = 0; j < contentBody.length; j++) {
                contentHash = ((contentHash << 5) - contentHash) + contentBody.charCodeAt(j);
                contentHash = contentHash & contentHash;
            }
            // 3. 对附件内容进行哈希
            for (let j = 0; j < contentFile.length; j++) {
                contentHash = ((contentHash << 5) - contentHash) + contentFile.charCodeAt(j);
                contentHash = contentHash & contentHash;
            }
            // 生成更可靠的唯一ID:
            // - 包含完整日期时间
            // - 包含内容哈希 
            // - 包含该时间戳的出现次数（处理同一时间的多条内容）
            // - 包含总的处理顺序（作为最后的防冲突保障）
            const memoId = `${dateTime}_${Math.abs(contentHash)}_${occurrenceCount}_${totalMemoCount}`;
            console.debug(`备忘录 #${totalMemoCount}: 时间=${dateTime}, 哈希=${Math.abs(contentHash)}, 同时间第${occurrenceCount}条, ID=${memoId}`);
            // 检查这个备忘录是否已经同步过
            if (this.syncedMemoIds.includes(memoId)) {
                // 已同步的备忘录，跳过
                console.debug(`备忘录已存在，跳过: ${memoId}`);
                return;
            }
            // 这是一个新备忘录，增加计数
            this.newMemosCount++;
            console.debug(`发现新备忘录 #${this.newMemosCount}: ${memoId}`);
            // 将这个ID添加到已同步列表
            this.syncedMemoIds.push(memoId);
            const content = extractContent(contentBody) + "\n" + extractContent(contentFile);
            res.push({
                "title": title,
                "date": dateTime.split(" ")[0],
                "content": "📅 [[" + dateTime.split(" ")[0] + "]]" + " " + dateTime.split(" ")[1] + "\n\n" + content,
                "id": memoId // 保存备忘录ID
            });
        });
        console.debug(`处理完成: 总共 ${totalMemoCount} 条备忘录, 新增 ${this.newMemosCount} 条`);
        return res;
    }
    loadTags(tagNodes) {
        const res = [];
        tagNodes.slice(1).forEach(i => { res.push(i.textContent); });
        return res;
    }
}
exports.FlomoCore = FlomoCore;
