# Artalk 合并上下文

## 仓库概况

- **fork 来源**: ArtalkJS/Artalk (上游, remote: `upstream`)
- **工作分支**: `new`
- **当前版本**: v2.10.1（2026-11 完成合并）
- **后端测试地址**: `http://10.0.10.2:23366`
- **前端开发**: `cd ui/artalk && pnpm dev` (Vite, port 5500)

## 用户的自定义功能清单

| 功能 | 关键文件 |
|------|---------|
| 图片懒加载 (IntersectionObserver + spinner) | `context.ts` (lazyLoadImages), `artalk.ts` |
| 表情包悬浮放大 (owo-big) | `context.ts` (showOwoBig), `artalk.ts` |
| inkss.cn 链接跳转 | `comment/renders/header.ts`, `lib/marked-renderer.ts`, `plugins/list/copyright.ts`, `comment/renders/avatar.ts` |
| Layer 防重复创建 | `services/layer.ts`（v2.10.0 起挂载逻辑在此，不再是 layer-manager.ts） |
| 编辑器 SVG 图标 (i18n) | `i18n/zh-CN.ts` 等 (emoticon/preview/image/refresh 的 SVG 值) |
| Refresh 插件 | `plugins/editor/refresh.ts`, `plugins/editor/index.ts` (注册) |
| 表情包刷新按钮 | `plugins/editor/emoticons.ts` |
| 编辑器 DOM 结构 | `editor/editor.html` (send-btn 在 textarea-wrap 内) |
| 编辑器回复状态重写 | `plugins/editor/state-reply.ts` |
| editor-kit 独立面板 + 表情面板点击外部关闭 | `plugins/editor-kit.ts`（独立面板逻辑、Preview.toggle、Emoticons 关闭监听） |
| sanitizer 自定义 | `lib/sanitizer.ts`（img notitle、code language、无 lazyload class 白名单） |
| 回复按钮 span 实现 + $actionNormal | `comment/renders/actions.ts`, `comment/render.ts` |
| CSS 大量自定义样式 | `style/main.scss`, `style/editor.scss`, `style/comment.scss` 等 |
| 时间显示阈值 | `lib/utils.ts` (timeAgo days=30) |
| Tab 键检测 | `plugins/editor/textarea.ts` (e.code) |
| owo-big 暗黑模式同步 | `context.ts` (setDarkMode) |
| 图片加载失败处理 | `context.ts` (handleImageLoadFailure) |
| avatar 头像 lazy load | `comment/renders/avatar.ts` |
| 默认配置定制 | `defaults.ts`（countEl `#ArtalkCount`、pvEl `#ArtalkPV`、weavatar 镜像） |
| 管理员跳过 PV 统计 | `plugins/stat.ts`（localStorage `ArtalkAdminSkipPV`） |
| Go 后端定制 | `internal/artransfer/print.go`, `internal/config/var.go`, `internal/template/strategy_email.go`, `internal/template/strategy_notify.go`, `conf/artalk.example.zh-CN.yml` |
| `.github/` 目录整体删除 | 不使用上游 CI |

## v2.10.0 合并记录（2026-07）

### 方法
上次 v2.9.1 合并是手动复制内容（无 merge commit 父指针），git 祖先仍是 v2.8.5，
直接 merge 会产生大量虚假冲突。本次采用：
```
git merge-recursive v2.9.1 -- HEAD v2.10.0   # 指定 v2.9.1 为共同祖先
echo <v2.10.0-sha> > .git/MERGE_HEAD          # 生成正规双父 merge commit
```
**本次合并已生成正规 merge commit，下次升级可直接 `git merge <新tag>`。**

### 冲突解决摘要（32 个冲突）
- `.github/*` 14 个：保持删除（用户确认）
- `README.md`：保留 fork 版
- `ui/artalk/index.html`：上游新版 + 保留测试服务器地址/nestMax
- `types/editor.ts`, `paginator/*`：实际仅换行符差异，采用上游
- `context.ts`, `defaults.ts`, `sanitizer.ts`, `types/context.ts`, `marked-renderer.ts`, `editor-kit.ts`, `stat.ts`, `editor/index.ts`, `actions.ts`：以上游为基重新应用定制
- `comment.scss`：以 fork 为基，移除上游已删除的 `.atk-verified-icon`（新版用 main.scss 的 `atk-icon-verified`）

### v2.10.0 API 适配点
- `ContextApi` → `Context`；`ArtalkConfig` → `Config`
- Layer 挂载移至 `services/layer.ts`（DI 架构）
- `editor.ctx` 已移除：refresh.ts 改用 `kit.useData().fetchComments({ offset: 0 })`
- `kit.useGlobalCtx()` 已移除：preview.ts 改用 `kit.useEvents()`
- `getRenderer()` 需传参：`getRenderer({ imgLazyLoad })`
- editor-kit 方法更名：`openPlugPanel/closePlugPanel` → `openPluginPanel/closePluginPanel`
- 上游新增土耳其语 `i18n/tr.ts`：需补自定义键 `image`/`refresh`
- 删除死文件：`ui/artalk-sidebar/src/components/Header.vue`、`Tab.vue`（上次合并残留，已被 AppHeader.vue 取代）

### 验证
- `ui/artalk`、`ui/artalk-sidebar`、全部 plugin 包 pnpm build 通过
- Go 后端本机无工具链未编译，但 Go 侧无冲突、定制均为增量保留

## v2.10.1 合并记录（2026-11）

### 方法
- 祖先已修正（`v2.10.0` 为 merge-base），直接 `git fetch upstream --tags && git merge --no-ff v2.10.1`
- 合并前备份分支：`backup-before-v2.10.1-20261120`

### 冲突解决摘要（9 个）
- `.github/workflows/*` 6 个：保持删除
- `ui/artalk/src/plugins/editor/{emoticons,preview,upload}.ts`：上游给按钮图标加 `role="img"`，同时移除了 `useBtn()` 中的 `htmlDecode`；fork 依赖 i18n 中的自定义 SVG 图标。解决方式为显式 `Utils.htmlDecode($t(key))` 后注入 `<span role="img" aria-label="…">图标</span>`，保留自定义图标并通过上游新增的 `plug-btn-a11y.test.ts`
- `htmlDecode` 改用 `textContent` 代替 `innerText`，使 jsdom 测试环境与浏览器行为一致（仅影响编辑器按钮解码）

### 上游 v2.10.1 要点
- 后端安全修复：OAuth/邮箱验证回调、评论与通知归属、页面标题抓取域名白名单、comment query scope 校验、限速、guest 身份等；Go 侧无冲突，定制均为增量保留
- DOMPurify 收紧 data URL：仅允许 `img` 的栅格图片 mime；fork 的 `notitle`/`data-src`/`language` 等定制保留
- i18n 日文文案与 CJK 字体回退；土耳其语新增导出入口 `artalk/i18n/tr`
- 新增按钮无障碍、guest 身份、mount-destroy、package-exports 等测试

### 适配与杂项
- 既有 `marked.test.ts`、`sanitizer.test.ts` 两处断言更新为 fork 行为（code/img 不加 class、懒加载由 `context.ts` 统一处理）；上游新增安全测试全部保留
- README 版本说明更新至 v2.10.1
- `nightly` 为移动标签，本地旧值未覆盖，不影响版本合并

### 验证
- `pnpm test -- --run`：22 个测试文件、184 个用例全部通过
- `pnpm build`、`pnpm build:sidebar`、`pnpm build:plugins`、`pnpm test:plugins` 均通过
- Go 后端本机无工具链未编译，但 Go 侧无冲突、定制均为增量保留

## 注意事项

1. 下次合并直接 `git fetch upstream --tags && git merge <tag>`，祖先已正确
2. 后端二进制部署只需替换文件重启，GORM AutoMigrate 自动迁移数据库
3. 用户个人域名 `inkss.cn` 跳转逻辑分布在 4 个文件（header, avatar, marked-renderer, copyright）
4. SVG 图标定义在各语言 i18n 文件的 `emoticon`/`preview`/`image`/`refresh` 键中
5. 上游新增语言文件时需补 `image`/`refresh` 两个自定义键
