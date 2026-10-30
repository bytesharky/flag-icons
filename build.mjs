// build.mjs — 构建脚本：根据域名生成 flags.css（构建时产物，不入库）
//
// 用法（域名必填，二选一）：
//   node build.mjs https://example.com/   # 命令行参数传入资源域名
//   FLAG_DOMAIN=https://example.com/ node build.mjs   # 或环境变量传入
//
// 说明：纯 CSS 无法把变量拼进 url()，故域名在构建阶段注入到 dist/flags.css。
//       flags.css 为构建产物，已在 .gitignore 中忽略，请通过本脚本生成、不要提交。
//       域名未提供时直接抛出错误并退出（非零码），不会生成内容不可控的文件。
import { buildFlagsCSS } from "./gen-flags.mjs";

// 优先级：命令行参数 > 环境变量 FLAG_DOMAIN，二者均未提供则抛异常
const domain = process.argv[2] || process.env.FLAG_DOMAIN;
if (!domain) {
  console.error(
    "[build] 错误：未提供资源域名。\n" +
    "  用法：node build.mjs <domain>   或   FLAG_DOMAIN=<domain> node build.mjs\n" +
    "  例如：node build.mjs https://flag.doffish.com/"
  );
  process.exit(1);
}

console.log(`[build] 生成 flags.css，域名：${domain}`);
const n = buildFlagsCSS(domain);
console.log(`[build] 完成，共 ${n} 面旗帜 → dist/flags.css（构建产物，请勿提交）`);
