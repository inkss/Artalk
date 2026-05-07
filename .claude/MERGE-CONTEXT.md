# Artalk v2.9.1 合并上下文

## 仓库概况

- **fork 来源**: ArtalkJS/Artalk (上游)
- **fork 分支**: `new` (HEAD: `538ff621`)
- **合并分支**: `merge-v2.9.1` (HEAD: `fc25aa3e`)
- **base (共同祖先)**: `3255cb4b` (约 v2.8.4/v2.8.5)
- **上游 v2.9.1**: `b9c3b2a1`
- **后端测试地址**: `http://10.0.10.2:23366`
- **前端开发**: `cd ui/artalk && pnpm dev` (Vite, port 5500)

## 用户的 33 个自定义功能

| 功能 | 关键文件 |
|------|---------|
| 图片懒加载 (IntersectionObserver + spinner) | `context.ts` (lazyLoadImages), `artalk.ts` |
| 表情包悬浮放大 (owo-big) | `context.ts` (showOwoBig), `artalk.ts` |
| inkss.cn 链接跳转 | `comment/renders/header.ts`, `lib/marked-renderer.ts`, `plugins/list/copyright.ts`, `comment/renders/avatar.ts` |
| Layer 防重复创建 | `layer/layer-manager.ts`, `layer/wrap.ts` |
| 编辑器 SVG 图标 (i18n) | `i18n/zh-CN.ts` (emoticon/preview/image/refresh 的 SVG 值) |
| Refresh 插件 | `plugins/editor/refresh.ts`, `plugins/editor/index.ts` (注册) |
| 表情包刷新按钮 | `plugins/editor/emoticons.ts` (loadEmoticonsData forceRefresh) |
| 编辑器 DOM 结构 | `editor/editor.html` (send-btn 在 textarea-wrap 内, plug-btn-wrap 结构) |
| 编辑器回复状态重写 | `plugins/editor/state-reply.ts` |
| 分页器重写 | `list/paginator/index.ts`, `list/paginator/read-more.ts` |
| editor-kit 表情面板关闭 | `plugins/editor-kit.ts` |
| EditorApi 接口重写 | `types/editor.ts` |
| sanitizer 自定义 | `lib/sanitizer.ts` |
| CSS 大量自定义样式 | `style/main.scss`, `style/editor.scss`, `style/comment.scss` 等 |
| 时间显示阈值 | `lib/utils.ts` (timeAgo days=30) |
| Tab 键检测 | `plugins/editor/textarea.ts` (e.code) |
| owo-big 暗黑模式同步 | `context.ts` (setDarkMode) |
| 图片加载失败处理 | `context.ts` (handleImageLoadFailure) |
| avatar 头像 lazy load | `comment/renders/avatar.ts` |

## 合并策略与结果

### 已提交 (`fc25aa3e`) — 631 个文件
纯上游变更，用户从未修改过的文件。包含：
- 所有 Go 后端文件 (内部模块、server handlers、cmd 等)
- 所有 docs/landing/sidebar UI 文件
- 所有新文件 (plugin-auth, plugin-kit, 新 i18n 文件等)

### 未暂存 — 30 个 MIXED 文件 (用户需审核)
用户和上游都有改动，git 自动融合了双方内容。**需要逐个审核。**

**有风险的变更：**
- `editor/ui.ts` — `$nick` 改成 `$name`，但 `editor.html` 模板 input 还是 `name="nick"`，会导致编辑器昵称输入框找不到元素 → **需要把 editor.html 的 name="nick" 改成 name="name"**
- `closable.ts` — `isAdmin` 改成 `is_admin`，需确认后端 API 返回字段一致
- `state-edit.ts` — 依赖 `$name`，连带受影响

**无功能影响 (约 10 个)：** 仅 import 顺序调整。

**正常变更：** marked 升级 (全局实例→实例化)、darkMode auto 支持、社交登录 i18n、插件系统泛型支持等。

完整 30 个文件清单：
```
CHANGELOG.md
README.md
conf/artalk.example.zh-CN.yml
docs/docs/.vitepress/theme/Artalk.vue
docs/docs/code/ArtalkVersion.json
test/testdata/example_site_conf.yml
ui/artalk/package.json
ui/artalk/src/artalk.ts
ui/artalk/src/comment/render.ts
ui/artalk/src/comment/renders/actions.ts
ui/artalk/src/comment/renders/header.ts
ui/artalk/src/context.ts
ui/artalk/src/editor/editor.ts
ui/artalk/src/editor/ui.ts
ui/artalk/src/i18n/en.ts
ui/artalk/src/i18n/zh-TW.ts
ui/artalk/src/layer/layer-manager.ts
ui/artalk/src/layer/layer.ts
ui/artalk/src/layer/sidebar-layer.ts
ui/artalk/src/layer/wrap.ts
ui/artalk/src/lib/marked.ts
ui/artalk/src/lib/utils.ts
ui/artalk/src/plugins/editor/_plug.ts
ui/artalk/src/plugins/editor/closable.ts
ui/artalk/src/plugins/editor/state-edit.ts
ui/artalk/src/plugins/editor/state-reply.ts
ui/artalk/src/plugins/editor/submit-btn.ts
ui/artalk/src/plugins/editor/textarea.ts
ui/artalk/src/types/context.ts
ui/artalk/vite.config.ts
```

### 已从 fork 还原 — 5 个 LOST 文件
git 合并时用户的改动被静默丢弃（合并结果等于上游），已手动恢复为 fork 版本：
```
ui/artalk/src/lib/sanitizer.ts
ui/artalk/src/list/paginator/index.ts
ui/artalk/src/list/paginator/read-more.ts
ui/artalk/src/plugins/editor-kit.ts
ui/artalk/src/types/editor.ts
```

## 分支与提交结构

```
3255cb4b (base) --- 538ff621 (fork HEAD, branch: new)
                    \
                     fc25aa3e (merge-v2.9.1, 631 auto-merged files)
                        + 30 unstaged MIXED files
                        + 5 restored LOST files (fork content)
```

## 注意事项

1. `.github/` 相关文件在 fork 中被用户删除，合并时正确保留了删除（已随 631 文件提交）
2. 配置文件 `editor.html` 的 `name="nick"` 需要改成 `name="name"` 配合上游重命名
3. 后端二进制部署只需替换文件重启，GORM AutoMigrate 会自动处理数据库迁移
4. 用户个人域名 `inkss.cn` 的链接跳转逻辑分布在 4 个文件中（header, avatar, marked-renderer, copyright）
5. SVG 图标定义在 `i18n/zh-CN.ts` 的 `emoticon`/`preview`/`image`/`refresh` 键中
