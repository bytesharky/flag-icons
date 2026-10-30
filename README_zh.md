[English](README.md)

# Flag Icons · 旗帜图标资源

纯 **SVG** 旗帜图标资源库，配套一个 `index.html` 预览 / 文档站点，以及一个边缘函数 `region-name` 用于按代码反查地区名。资源文件按 `flag-icons` 的目录约定组织：仅 SVG、仅两种比例。

---

## 目录结构

```
/
├── dist/                   # 构建产物 / 站点根目录（部署时发布此目录）
│   ├── index.html          # 预览 + 使用文档 + 接口说明
│   ├── 404.html            # 自定义 404 页面
│   ├── flags.css           # 类名方式样式 —— 构建产物（node build.mjs 生成），不入库
│   ├── 4x3/                # 4:3 矩形旗帜，271 个 SVG（viewBox 0 0 640 480）
│   ├── 1x1/                # 1:1 方形旗帜，271 个 SVG（viewBox 0 0 512 512）
│   ├── assets/
│   │   ├── flag.js         # 预览页交互逻辑（搜索 / 比例切换 / 缩放 / 地区名接口）
│   │   ├── style.css       # 预览页样式
│   │   ├── 404.css         # 404 页面样式
│   │   ├── backtop.js      # 返回顶部交互逻辑
│   │   ├── favicon.png     # 浏览器图标
│   │   └── apple-icon.png  # iOS 保存到桌面的图标
│   └── download/
│       ├── flag_4x3.zip    # 4:3 全量打包（约 0.65 MB）
│       └── flag_1x1.zip    # 1:1 全量打包（约 0.65 MB）
├── edge-functions/         # 边缘函数源码（部署时挂载）
│   └── region-name.js      # 边缘函数：code → 地区名（中/英）
├── middleware.js           # EdgeOne Pages 中间件（404 路由重写）
├── edgeone.json            # EdgeOne Pages 部署配置（缓存头 / 内容类型）
├── gen-flags.mjs           # flags.css 生成器模块（buildFlagsCSS(domain)）
├── build.mjs               # 构建脚本：node build.mjs [domain] → dist/flags.css
├── LICENSE                 # MIT License · © 2026 Sharky
├── README.md               # 英文说明（English）
└── README_zh.md            # 本说明（中文）
```

> 说明：`dist/` 是站点的构建产物，部署时发布此目录。`flags.css` 由 `build.mjs` 生成的构建产物（域名在构建时注入），已在 `.gitignore` 中忽略、不入库，运行 `node build.mjs [domain]` 即可（重新）生成。`edgeone.json` 是部署到腾讯 EdgeOne 的配置文件（缓存策略 / 内容类型）；`edge-functions/` 存放需挂载的边缘函数源码。

---

## 资源说明

- **单一格式**：只有 SVG，矢量、任意尺寸不失真。没有 PNG / WebP / 多尺寸档位。
- **两种比例**：文件名完全一致、一一对应，各 271 个，共 542 个文件：

  | 目录 | 比例 | viewBox | 典型用途 |
  |------|------|---------|----------|
  | `4x3/` | 4:3 | `0 0 640 480` | 标准矩形国旗 |
  | `1x1/` | 1:1 | `0 0 512 512` | 头像 / 圆形 / 方形容器 |

- **命名规则**：`<比例目录>/<代码>.svg`，代码一律小写。
  - 国家：`cn`、`us`、`jp`、`br` …（ISO 3166-1 **alpha-2**）
  - 子区域：`gb-eng`（英格兰）、`gb-sct`、`es-ct`（加泰罗尼亚）、`es-ga`、`es-pv`、`sh-ac`、`sh-hl`、`sh-ta` …（连字符形式）
  - 组织 / 补充码：`eu`、`un`、`arab`、`asean`、`cefta`、`eac`、`pc`、`ic`、`cp`、`dg`、`xx` 等 17 个非 ISO 补充码

- **遵循一个中国原则**：`tw → 中国台湾`、`hk → 中国香港`、`mo → 中国澳门`，在 `flag.js` 与 `region-name.js` 中均通过 `OVERRIDE` 表固定。

---

## 演示站点

在线演示：**https://flag.doffish.com/** 

> 可在线浏览全部旗帜、地区名接口、flags.css

---

## 快速开始

可部署的站点位于 `dist/` 目录。本地构建并预览：

```bash
# 1) （重新）生成 dist/flags.css，资源域名必填（二选一）
node build.mjs https://your.cdn/               # 方式一：命令行参数传入域名
FLAG_DOMAIN=https://your.cdn/ node build.mjs   # 方式二：环境变量传入域名
# 未提供域名会直接报错退出（exit 1），不会生成内容不可控的文件

# 2) 预览
cd dist && python -m http.server 8000
# 打开 http://127.0.0.1:8000
```

> `flags.css` 由 `build.mjs` 生成，已被 `.gitignore` 忽略，不属于提交源码的一部分。

路径规则：`<比例目录>/<代码>.svg`。

常见约定：先选比例再定尺寸；始终显式声明 `width/height` 或用 `aspect-ratio`；务必写 `alt`（装饰场景留空串，有含义时写国家/地区名）。

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
  width: 48px; 
  aspect-ratio: 1 / 1;      /* 锁定比例，避免布局抖动 */
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
- `flags.css` 由构建脚本生成 —— 把域名作为命令行参数传入，域名会在构建时注入到每一条规则（纯 CSS 无法把变量拼进 `url()`）：
  ```bash
  node build.mjs https://your.cdn/               # → dist/flags.css（构建产物，已 gitignore，构建时重新生成）
  FLAG_DOMAIN=https://your.cdn/ node build.mjs   # 或改用环境变量传入域名
  ```
- 域名必填：命令行参数或 `FLAG_DOMAIN` 环境变量二选一，未提供会报错退出（exit 1）。

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

> 本地调试：用任意 Node 静态服务 + 一个 `/region-name` 代理把请求转发给本文件的 `onRequestGet` 即可。

---

## 部署到腾讯 EdgeOne（Fork 即用）

本项目可直接 **Fork** 后在 [腾讯云 EdgeOne](https://edgeone.ai/)（边缘安全加速平台 / **EdgeOne Pages**）一键发布。演示站点 **https://flag.doffish.com/** 即按此方式部署。

**1. Fork 仓库**

点击右上角 **Fork** 把仓库复制到你的账号。

**2. 在 EdgeOne Pages 创建项目并连接仓库**

- 进入 EdgeOne 控制台 → 创建项目 → 通过导入 Git 仓库创建 ，选择你 Fork 后的 Git 仓库。
- 构建配置：
  - **根目录 / 输出目录**：`/`。
  - **构建命令**：`node build.mjs https://your-domain/`（域名必填；或在平台环境变量中设置 `FLAG_DOMAIN`，再写 `node build.mjs`）。构建时生成 `dist/flags.css`。
  - **输出目录**：`dist`。

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
- 如需自定义域名（如 `flag.yourdomain.com`），在控制台 **域名 / 绑定** 处添加并配置 CNAME 即可。
- 要把你的域名写进 `flags.css`，用该域名构建：`node build.mjs https://flag.yourdomain.com/`（或设置 `FLAG_DOMAIN` 环境变量）后重新部署。

**5. 验证**

打开你的站点域名，确认：
- 旗帜预览、比例切换、使用说明均正常；
- 访问 `https://你的域名/region-name?code=cn&lang=zh` 返回 `{"ok":true,"code":"cn","lang":"zh","name":"中国"}`。

---

## 下载打包

- `dist/download/flag_4x3.zip` —— 4:3 全量（271 个 SVG，约 0.65 MB）
- `dist/download/flag_1x1.zip` —— 1:1 全量（271 个 SVG，约 0.65 MB）

只用到一种比例时，删掉另一个目录即可；按名单取子集直接 `cp` 对应文件。

需要位图时自行栅格化（如 `rsvg-convert -w 96 -h 72 dist/4x3/cn.svg -o cn-96x72.png`）。

---

## 许可

本项目以 [MIT License](./LICENSE) 发布，版权所有 © 2026 Sharky。
