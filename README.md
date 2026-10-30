# Flag Icons · 旗帜图标资源

纯 **SVG** 旗帜图标资源库，配套一个 `index.html` 预览 / 文档站点，以及一个边缘函数 `region-name` 用于按代码反查地区名。资源文件按 `flag-icons` 的目录约定组织：仅 SVG、仅两种比例。

---

## 目录结构

```
/
├── index.html              # 预览 + 使用文档 + 接口说明
├── 404.html                # 自定义 404 页面（样式见 assets/404.css）
├── flags.css               # 类名方式样式（由 assets/gen-flags.mjs 生成，域名在生成阶段注入）
├── README.md               # 本说明
├── LICENSE                 # MIT License · © 2026 Sharky
├── edgeone.json            # 腾讯 EdgeOne 部署配置（缓存头 / 内容类型）
├── middleware.js           # EdgeOne Pages 中间件（404 路由重写）
├── 4x3/                    # 4:3 矩形旗帜，271 个 SVG（viewBox 0 0 640 480）
├── 1x1/                    # 1:1 方形旗帜，271 个 SVG（viewBox 0 0 512 512）
├── assets/
│   ├── flag.js             # 预览页交互逻辑（搜索 / 比例切换 / 缩放 / 地区名接口）
│   ├── style.css           # 预览页样式
│   ├── 404.css             # 404 页面样式
│   ├── gen-flags.mjs       # flags.css 生成器（唯一域名变量 FLAG_DOMAIN）
│   ├── backtop.js          # 返回顶部
│   ├── favicon.png         # 浏览器图标
│   └── apple-icon.png      # ios保存到桌面的图标
├── download/
│   ├── flag_4x3.zip        # 4:3 全量打包（约 0.65 MB）
│   └── flag_1x1.zip        # 1:1 全量打包（约 0.65 MB）
└── edge-functions/
    └── region-name.js      # 边缘函数：code → 地区名（中/英）
```

> 说明：`edgeone.json` 与 `middleware.js` 是部署到腾讯 EdgeOne 时使用的配置（缓存策略、`/404.html` 的 404 重写规则），纯静态托管可忽略；`.edgeone/`、`functions/` 等为平台运行时目录，不纳入版本管理。

---

## 资源说明

- **格式**：只有 SVG，矢量、任意尺寸不失真。没有 PNG / WebP / 多尺寸档位。
- **两种比例**（文件名完全一致、一一对应，各 271 个，共 542 个文件）：

  | 目录 | 比例 | viewBox | 典型用途 |
  |------|------|---------|----------|
  | `4x3/` | 4:3 | `0 0 640 480` | 标准矩形国旗 |
  | `1x1/` | 1:1 | `0 0 512 512` | 头像 / 圆形 / 方形容器 |

- **命名规则**：`<比例目录>/<代码>.svg`，代码一律小写。
  - 国家：`cn`、`us`、`jp`、`br` …（ISO 3166-1 **alpha-2**）
  - 子区域：`gb-eng`（英格兰）、`gb-sct`、`es-ct`（加泰罗尼亚）、`es-ga`、`es-pv`、`sh-ac`、`sh-hl`、`sh-ta` …（连字符形式）
  - 组织 / 补充码：`eu`、`un`、`arab`、`asean`、`cefta`、`eac`、`pc`、`ic`、`cp`、`dg`、`xx` 等 17 个非 ISO 补充码

- **政治表述**：`tw → 中国台湾`、`hk → 中国香港`、`mo → 中国澳门`、`xk → 科索沃`，遵循一个中国原则，在 `flag.js` 与 `region-name.js` 中均通过 `OVERRIDE` 表固定。

---

## 演示站点

作者已发布在线演示：**https://flag.doffish.com/** — 可在线浏览全部旗帜、地区名接口，也是 `flags.css` 默认指向的域名（`https://flag.doffish.com/4x3/cn.svg`）。

---

## 快速开始

直接预览（`index.html` 使用相对路径引用资源，双击 `file://` 打开即可）：

```bash
# 或起一个静态服务（推荐，避免个别浏览器对 file:// 的限制）
python -m http.server 8000
# 打开 http://127.0.0.1:8000
```

> 提示：站点里的「地区名接口」测试面板需要同源的 `/region-name` 路由；纯静态托管时该面板将无法请求，但页面其它功能不受影响。把 `edge-functions/region-name.js` 部署为边缘函数后即可使用（见下文「部署到腾讯 EdgeOne」）。

---

## 使用方式

路径规则：`<比例目录>/<代码>.svg`。

```html
<!-- ① 4:3 矩形：默认用法 -->
<img src="4x3/cn.svg" width="48" height="36" alt="中国">

<!-- ② 1:1 方形：头像 / 圆形容器 -->
<img src="1x1/cn.svg" width="48" height="48" alt="中国">

<!-- ③ 行内图标：宽高按 4:3 折算 -->
<img src="4x3/us.svg" width="20" height="15" alt="美国" loading="lazy">

<!-- ④ 同一份 SVG 可直接放大到任意尺寸 -->
<img src="4x3/cn.svg" width="320" height="240" alt="中国">
```

```css
.flag-4x3 {                 /* 4:3 背景图 */
  width: 48px;
  aspect-ratio: 4 / 3;      /* 锁定比例，避免布局抖动 */
  background: url("4x3/cn.svg") center / contain no-repeat;
}
.flag-1x1 {                 /* 1:1 圆形头像 */
  width: 48px; aspect-ratio: 1 / 1;
  background: url("1x1/cn.svg") center / cover no-repeat;
  border-radius: 50%;
}
```

```jsx
// React —— 只需传 ratio 即可切换方形 / 矩形
const H = { "4x3": 0.75, "1x1": 1 };
const Flag = ({ code = "cn", ratio = "4x3", size = 48, alt = "" }) => (
  <img src={`${ratio}/${code}.svg`}
       width={size} height={Math.round(size * H[ratio])}
       alt={alt || code} loading="lazy" />
);
```

```vue
<!-- Vue -->
<script setup>
const props = defineProps({ code:{type:String,default:"cn"}, ratio:{type:String,default:"4x3"}, size:{type:Number,default:48} });
const H = { "4x3": 0.75, "1x1": 1 };
const h = computed(() => Math.round(props.size * H[props.ratio]));
const src = computed(() => `${props.ratio}/${props.code}.svg`);
</script>
<template><img :src="src" :width="size" :height="h" :alt="code" loading="lazy" /></template>
```

### CSS 类名方式（`flags.css`）

引入 `flags.css` 后，直接用类名挂旗帜，无需 `<img>`、无需写尺寸：

```html
<link rel="stylesheet" href="flags.css">

<i class="flag-cn"></i>          <!-- 4:3 矩形 -->
<i class="flag-cn fis"></i>      <!-- 1:1 方形（加 .fis） -->
<i class="flag-us" style="--fs:32px"></i>   <!-- 用 --fs 控制高度，默认 1em -->
```

- 规则：`.flag-<代码>` 为 4:3；`.flag-<代码>.fis` 为 1:1。代码即文件名（小写 alpha-2，子区域用连字符）。
- 域名在 `assets/gen-flags.mjs` 顶部 `FLAG_DOMAIN` 一处配置，改完运行 `node assets/gen-flags.mjs` 重新生成 `flags.css`（纯 CSS 无法把变量拼进 `url()`，故在生成阶段注入）。
- 当前域名：`https://flag.doffish.com/`。

常见约定：先选比例再定尺寸；始终显式声明 `width/height` 或用 `aspect-ratio`；务必写 `alt`（装饰场景留空串，有含义时写国家/地区名）。

---

## 地区名接口 · `region-name`

一个边缘函数，输入地区代码，返回中文 / 英文名称。兼容 Cloudflare Workers 风格（`export async function onRequestGet({ request })`）。

**请求**

```
GET /region-name?code=<code>&lang=<zh|en>
```

| 参数 | 说明 | 默认 |
|------|------|------|
| `code` | alpha-2 / alpha-3 / M49 三位数字码，大小写不敏感；支持 `gb-eng`、`es-ct`、`sh-ac` 等子区域 | 必填 |
| `lang` | `zh`（中文）| `en`（英文） | `en` |

**返回**（JSON，`Access-Control-Allow-Origin: *`）

```jsonc
// 命中：code 统一回落为小写 alpha-2，可直接拼 URL
{ "ok": true,  "code": "cn", "lang": "zh", "name": "中国" }

// 查不到（合法格式但未收录）
{ "ok": false, "code": "qqq", "lang": "en" }

// 缺参数：HTTP 400
{ "ok": false, "error": "缺少 code 参数" }
```

**示例**

```bash
curl "https://你的域名/region-name?code=cn&lang=zh"
# {"ok":true,"code":"cn","lang":"zh","name":"中国"}

curl "https://你的域名/region-name?code=156&lang=zh"   # M49 数字码 → 中国
curl "https://你的域名/region-name?code=eu&lang=zh"    # 欧洲联盟
curl "https://你的域名/region-name?code=gb-eng&lang=en" # England
```

```js
// 配合旗帜：拿到名字后直接拼 SVG 路径
const r = await fetch(`/region-name?code=${code}&lang=zh`).then(x => x.json());
if (r.ok) {
  const img = new Image();
  img.src = `4x3/${r.code}.svg`;   // r.code 已是小写 alpha-2
  label.textContent = r.name;
}
```

要点：

- **文件名即路由**：返回的 `code` 一律小写 alpha-2，可直接拼成 `4x3/<code>.svg` / `1x1/<code>.svg`。
- **三种编码归一**：alpha-2 / alpha-3 / M49 数字码都先映射到 alpha-2 再查名。
- **已开 CORS**：前端跨域直连无压力；`OPTIONS` 预检直接放行。
- **用 `ok` 判断命中**：未收录地区返回 200 + `ok:false`，不要依赖 HTTP 状态码区分。

**部署**（任选边缘运行时）

```bash
# Cloudflare Workers / Pages Functions：把文件放到 functions/region-name.js 即可
# 也可作为任意支持 onRequestGet 约定的边缘函数接入
```

> 本地调试：用任意 Node 静态服务 + 一个 `/region-name` 代理把请求转发给本文件的 `onRequestGet` 即可（预览用的临时服务就是这么接的）。

---

## 部署到腾讯 EdgeOne（Fork 即用）

本项目可直接 **Fork** 后在 [腾讯云 EdgeOne](https://edgeone.ai/)（边缘安全加速平台 / **EdgeOne Pages**）一键发布，同时托管静态站点与 `region-name` 边缘函数。作者演示站点 **https://flag.doffish.com/** 即按此方式部署。

**1. Fork 仓库**

点击右上角 **Fork** 把仓库复制到你的账号。整个站点以本目录（`flag/flag/`）为根，结构即上方「目录结构」所示。

**2. 在 EdgeOne Pages 创建项目并连接仓库**

- 进入 EdgeOne 控制台 → **Pages / 边缘 Pages** → 新建项目 → 选择你 Fork 后的 Git 仓库。
- 构建配置：
  - **根目录 / 输出目录**：填本站点所在目录（即包含 `index.html` 与 `4x3/`、`1x1/`、`assets/`、`edge-functions/` 的那一层）。
  - **构建命令**：留空（纯静态，无需构建）。
  - **输出目录**：同上根目录（直接发布根目录内容）。

**3. 挂载边缘函数 `region-name`**

EdgeOne Pages 的边缘函数约定放在 `edge-functions/` 目录、按路径路由，并支持 `onRequestGet` 这类方法级导出（本项目 `region-name.js` 正是该风格），可直接使用。

> 若你的 EdgeOne 版本使用其它函数目录约定（如 `_functions/` 或 `functions/`），按平台指引放置 `region-name.js` 即可，函数导出签名 `onRequestGet` 无需改动。

```bash
# 在本站点根目录下，让路由 /region-name 命中该边缘函数
mkdir -p functions
cp edge-functions/region-name.js functions/region-name.js
```

**4. 发布并绑定域名**

- 保存后 EdgeOne 会自动构建并分配一个 `*.edgeone.app` 预览域名；推送 / 重新部署即更新。
- 如需自定义域名（如 `flag.yourdomain.com`），在控制台 **域名 / 绑定** 处添加并配置 CNAME 即可。要把 `flags.css` 的默认域名改为你的域名，编辑 `assets/gen-flags.mjs` 顶部的 `FLAG_DOMAIN` 后重新生成 `flags.css`。

**5. 验证**

打开你的站点域名，确认：
- 旗帜预览、比例切换、使用说明均正常；
- 访问 `https://你的域名/region-name?code=cn&lang=zh` 返回 `{"ok":true,"code":"cn","lang":"zh","name":"中国"}`。

---

## 下载打包

- `download/flag_4x3.zip` —— 4:3 全量（271 个 SVG，约 0.65 MB）
- `download/flag_1x1.zip` —— 1:1 全量（271 个 SVG，约 0.65 MB）

只用到一种比例时，删掉另一个目录即可；按名单取子集直接 `cp` 对应文件。

需要位图时自行栅格化（如 `rsvg-convert -w 96 -h 72 4x3/cn.svg -o cn-96x72.png`）。

---

## 许可

本项目以 [MIT License](./LICENSE) 发布，版权所有 © 2026 Sharky。
