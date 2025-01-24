# Cursor Translate 教程

## 0. 前言

这是一篇简单的从前端开发人员视角介绍 Cursor 编辑器的教程,主要介绍 Cursor 编辑器的安装和使用,以及如何使用 Cursor 编辑器生成代码,并按照产品需求,完善代码,并优化 UI 界面;

教程文档: [`Cursor Translate 教程`](/cursor-translate教程.md)

教程配套的 git 代码仓库: [`Cursor Translate 翻译应用项目实战`](https://github.com/strawferry/cursor-translate)

AI 交互的记录文档: [`Cursor Composer 记录`](/.specstory/history/composer-交互.md)


-----

> 以下是产品文档

# Translate 中英文互译

一个基于 AI 的中英文双向翻译工具，支持段落翻译、语音播报和历史记录功能。

## 功能特点

1. 智能翻译
   - 支持中英文双向翻译
   - 基于 DeepSeek AI 模型，提供高质量翻译结果
   - 支持长文本和段落翻译

2. 双模式显示
   - 整体翻译模式：直接显示完整翻译结果
   - 对照模式：原文与译文段落交错显示，类似双语字幕格式
   
3. 语音功能
   - 支持翻译结果的语音播报
   - 可调节语音播放速度和音量
   - 支持中英文发音

4. 历史记录
   - 自动保存翻译历史
   - 支持查看和管理历史记录
   - 支持收藏常用翻译

## 技术架构

### 前端技术
- Next.js
- React 
- TailwindCSS
- Web Speech API (语音合成)

### 后端技术
- Next.js API Routes
- DeepSeek API 集成
- 数据库存储 (可选 PostgreSQL/MongoDB)

### AI 模型
- DeepSeek 大语言模型
- API 文档：[DeepSeek API Documentation](https://api-docs.deepseek.com/zh-cn/)
