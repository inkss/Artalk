<p align="center">
<img src="https://user-images.githubusercontent.com/22412567/171680920-6e74b77c-c565-487b-bff1-4f94976ecbe7.png" alt="Artalk" width="100%">
</p>

> 自用仓库、依赖仓库~

*A Self-hosted Comment System~*

## 引用地址

CDN 会保留各历史版本，将下方模板中的 `<version>` 替换为所需版本号即可：

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/inkss/inkss-cdn@main/js/Artalk.v<version>.css">

<!-- JS -->
<script src="https://cdn.jsdelivr.net/gh/inkss/inkss-cdn@main/js/Artalk.v<version>.js"></script>
```

当前已发布版本：

- [v2.10.0（最新）](https://github.com/ArtalkJS/Artalk/releases/tag/v2.10.0)
- [v2.9.1](https://github.com/ArtalkJS/Artalk/releases/tag/v2.9.1)

## 自定义功能清单

### 1. 表情包放大预览

鼠标悬停在评论中的表情包上时，放大显示表情图片。使用事件委托监听 pointerover/pointerout 事件，300ms 延迟后显示放大预览框。

- **文件**: `ui/artalk/src/context.ts` (showOwoBig 方法)

### 2. 图片懒加载（内置实现）

评论中的图片使用懒加载，带 loading 动画占位。上游项目有 `imgLazyLoad` 配置选项，但本项目内置了具体实现，不能再自定义。

- **文件**: `ui/artalk/src/context.ts` (lazyLoadImages 方法)

### 3. 图片加载失败处理

图片加载失败时显示错误状态，表情包显示"表情加载失败"提示。

- **文件**: `ui/artalk/src/context.ts` (handleImageLoadFailure 方法)

### 4. 刷新按钮

编辑器区域添加刷新按钮，点击可重新加载评论列表。

- **文件**: `ui/artalk/src/plugins/editor/refresh.ts`

### 5. 提交按钮默认隐藏

提交按钮默认隐藏，mounted 后才显示。

- **文件**: `ui/artalk/src/plugins/editor/submit-btn.ts`

### 6. 表情选择框优化

- 表情图片懒加载（data-src, loading="lazy"）
- 支持 notitle 属性，控制是否显示标题
- 点击事件添加 stopPropagation 防止冒泡

- **文件**: `ui/artalk/src/plugins/editor/emoticons.ts`

### 7. 管理员访问 PV 不增加（隐藏功能）

管理员登录后访问网站，页面浏览量 PV 不增加。

**开关**: 默认关闭，需手动在浏览器控制台执行以下命令开启：

```javascript
localStorage.setItem('ArtalkAdminSkipPV', 'true')
```

- **文件**: `ui/artalk/src/plugins/stat.ts`

### 8. 样式自定义

评论区、编辑器、侧边栏等样式调整，包括：

- 评论区样式优化
- 编辑器样式调整
- 侧边栏样式优化
- Code 和链接样式修订
- 弹出层渐进动画

- **文件**: `ui/artalk/src/style/` 目录下多个样式文件
