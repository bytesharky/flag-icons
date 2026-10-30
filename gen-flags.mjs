// gen-flags.mjs — 生成 flags.css 的生成器（被 build.mjs 调用）
// 域名在调用时作为参数传入；也可直接运行：node gen-flags.mjs [domain]
import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, "dist"); // flag/flag/dist

/**
 * 根据域名生成 dist/flags.css
 * @param {string} domain 资源域名（必填，结尾是否带 / 均可），如 https://flag.doffish.com/
 * @returns {number} 生成的旗帜数量
 * @throws 当 domain 未提供时抛出错误
 */
export function buildFlagsCSS(domain) {
  if (!domain) {
    throw new Error(
      "buildFlagsCSS 需要资源域名参数（domain 必填）。\n" +
      "  用法：node build.mjs <domain>   或   FLAG_DOMAIN=<domain> node build.mjs"
    );
  }
  const base = domain.endsWith("/") ? domain : domain + "/";

  const codes = readdirSync(join(ROOT, "4x3"))
    .filter((f) => f.endsWith(".svg"))
    .map((f) => f.slice(0, -4))
    .sort();

  let css = `/* flags.css — 由 build.mjs / gen-flags.mjs 自动生成，请勿手改。
 * 重新生成：node build.mjs <domain>
 *
 * 用法（HTML）：
 *   <i class="flag-cn"></i>        4:3 矩形
 *   <i class="flag-cn fis"></i>    1:1 方形
 * 可用 --fs 控制高度（默认 1em），如 style="--fs:24px"
 */

/* 基础样式：匹配所有 .flag-xxx */
[class*="flag-"] {
  display: inline-block;
  height: var(--fs, 1em);             /* 4:3 时宽度由 aspect-ratio 推导 */
  aspect-ratio: 4 / 3;
  background-color: #e9ecef;          /* SVG 加载前的占位底色 */
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
    css += `.flag-${c} { background-image: url("${base}4x3/${c}.svg"); }\n`;
    css += `.flag-${c}.fis { background-image: url("${base}1x1/${c}.svg"); }\n`;
  }

  writeFileSync(join(ROOT, "flags.css"), css);
  console.log(`flags.css 已生成：${codes.length} 个国家/地区，每条 2 个比例（域名 ${base}）`);
  return codes.length;
}

// 直接运行：node gen-flags.mjs <domain>
const isMain = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  try {
    buildFlagsCSS(process.argv[2]);
  } catch (e) {
    console.error(`[gen-flags] ${e.message}`);
    process.exit(1);
  }
}
