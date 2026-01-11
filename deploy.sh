#!/bin/bash

# Get笔记 Importer 部署脚本
# 先构建，然后自动将插件文件复制到 Obsidian vault

# 配置说明：请将此脚本复制为 deploy.local.sh 并修改下面的路径
# VAULT_PATH 应该指向你的 Obsidian vault 根目录
# 例如: VAULT_PATH="/Users/你的用户名/Documents/Obsidian/你的vault名称"

# 如果未设置 VAULT_PATH 环境变量，使用默认路径
if [ -z "$VAULT_PATH" ]; then
    echo "⚠️  请设置 VAULT_PATH 环境变量或复制此脚本为 deploy.local.sh 并修改路径"
    echo "   例如: export VAULT_PATH=\"/Users/your-username/Documents/Obsidian/YourVault\""
    echo "   或者: cp deploy.sh deploy.local.sh 然后编辑 deploy.local.sh"
    exit 1
fi

PLUGIN_DIR="$VAULT_PATH/.obsidian/plugins/get-importer"

echo "🚀 开始部署 Get笔记 Importer 插件..."
echo ""

# 先构建
echo "🔨 构建插件..."
node esbuild.config.mjs production
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
