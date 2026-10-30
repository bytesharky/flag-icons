// gen-flags.mjs — 生成 flags.css
// 域名在这里作为唯一变量配置；改完重新运行：
//   node assets/gen-flags.mjs
// 说明：纯 CSS 无法把变量拼进 url()，所以域名在生成阶段注入，
//       flags.css 中每条规则都使用同一份域名，改域名只需改这里并重生成。

import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");                 // flag/flag/
const FLAG_DOMAIN = "https://flag.doffish.com/";    // ← 唯一域名变量

const codes = readdirSync(join(ROOT, "4x3"))
  .filter((f) => f.endsWith(".svg"))
  .map((f) => f.slice(0, -4))
  .sort();

let css = `/* flags.css — 由 assets/gen-flags.mjs 自动生成，请勿手改。
 * 修改域名：编辑 gen-flags.mjs 顶部的 FLAG_DOMAIN 后运行 node assets/gen-flags.mjs
 *
 * 用法：
 *   <i class="flag-cn"></i>        4:3 矩形
 *   <i class="flag-cn fis"></i>    1:1 方形
 * 可用 --fs 控制高度（默认 1em），如 style="--fs:24px"
 */

/* 基础样式：匹配所有 .flag-xxx */
[class*="flag-"] {
  display: inline-block;
  height: var(--fs, 1em);             /* 4:3 时宽度由 aspect-ratio 推导 */
  aspect-ratio: 4 / 3;
  background-color: #e9ecef;        /* SVG 加载前的占位底色 */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;             /* 填充模式防止缩放精度出现露底 */
  vertical-align: -0.125em;
  border-radius: 2px;
  overflow: hidden;
}

/* 1:1 方形：加 .fis 即可 */
[class*="flag-"].fis {
  aspect-ratio: 1 / 1;
}

`;

for (const c of codes) {
  css += `.flag-${c} { background-image: url("${FLAG_DOMAIN}4x3/${c}.svg"); }\n`;
  css += `.flag-${c}.fis { background-image: url("${FLAG_DOMAIN}1x1/${c}.svg"); }\n`;
}

writeFileSync(join(ROOT, "flags.css"), css);
console.log(`flags.css 已生成：${codes.length} 个国家/地区，每条 2 个比例`);
