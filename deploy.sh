#!/bin/bash

# Flomo Importer 部署脚本
# 先构建，然后自动将插件文件复制到 Obsidian vault

VAULT_PATH="/Users/huashan/Documents/Obsidian/Main"
PLUGIN_DIR="$VAULT_PATH/.obsidian/plugins/flomo-importer"

echo "🚀 开始部署 Flomo Importer 插件..."
echo ""

# 先构建
echo "🔨 构建插件..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi
echo ""

# 创建插件目录（如果不存在）
if [ ! -d "$PLUGIN_DIR" ]; then
    echo "📁 创建插件目录: $PLUGIN_DIR"
    mkdir -p "$PLUGIN_DIR"
fi

# 检查必需文件是否存在
if [ ! -f "main.js" ]; then
    echo "❌ 错误: main.js 不存在"
    exit 1
fi

# 复制文件
echo "📋 复制文件到 Obsidian..."
cp -v main.js "$PLUGIN_DIR/"
cp -v manifest.json "$PLUGIN_DIR/"
cp -v styles.css "$PLUGIN_DIR/"
echo ""

# 验证复制是否成功
if [ -f "$PLUGIN_DIR/main.js" ] && [ -f "$PLUGIN_DIR/manifest.json" ] && [ -f "$PLUGIN_DIR/styles.css" ]; then
    echo "✅ 部署成功！"
    echo ""
    echo "📂 插件目录: $PLUGIN_DIR"
    echo "📅 文件时间戳: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "📝 下一步:"
    echo "   1. 完全退出 Obsidian (⌘Q)"
    echo "   2. 重新打开 Obsidian"
    echo "   3. 测试导出功能"
    echo ""
else
    echo "❌ 部署失败，请检查文件权限"
    exit 1
fi
