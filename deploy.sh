#!/bin/bash

# Flomo Importer 部署脚本
# 自动将插件文件复制到 Obsidian vault

VAULT_PATH="/Users/huashan/Documents/Obsidian/Main"
PLUGIN_DIR="$VAULT_PATH/.obsidian/plugins/flomo-importer"

echo "🚀 开始部署 Flomo Importer 插件..."

# 创建插件目录（如果不存在）
if [ ! -d "$PLUGIN_DIR" ]; then
    echo "📁 创建插件目录: $PLUGIN_DIR"
    mkdir -p "$PLUGIN_DIR"
fi

# 检查必需文件是否存在
if [ ! -f "main.js" ]; then
    echo "❌ 错误: main.js 不存在，请先运行 'npm run build'"
    exit 1
fi

# 复制文件
echo "📋 复制 main.js..."
cp main.js "$PLUGIN_DIR/"

echo "📋 复制 manifest.json..."
cp manifest.json "$PLUGIN_DIR/"

echo "📋 复制 styles.css..."
cp styles.css "$PLUGIN_DIR/"

# 验证复制是否成功
if [ -f "$PLUGIN_DIR/main.js" ] && [ -f "$PLUGIN_DIR/manifest.json" ] && [ -f "$PLUGIN_DIR/styles.css" ]; then
    echo "✅ 部署成功！"
    echo ""
    echo "插件文件已复制到: $PLUGIN_DIR"
    echo ""
    echo "📝 下一步:"
    echo "   1. 重启 Obsidian 或在设置中重新加载插件"
    echo "   2. 确保插件已启用: 设置 → 社区插件 → Flomo Importer"
    echo "   3. 打开开发者工具查看日志: View → Toggle Developer Tools"
    echo ""
else
    echo "❌ 部署失败，请检查文件权限"
    exit 1
fi
