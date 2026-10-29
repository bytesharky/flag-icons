/* ---------- 数据：与 4x3/ / 1x1/ 两个目录下的文件完全一致（271 个） ---------- */
const CODES = "ad ae af ag ai al am ao aq ar arab as asean at au aw ax az ba bb bd be bf bg bh bi bj bl bm bn bo bq br bs bt bv bw by bz ca cc cd cefta cf cg ch ci ck cl cm cn co cp cr cu cv cw cx cy cz de dg dj dk dm do dz eac ec ee eg eh er es es-ct es-ga es-pv et eu fi fj fk fm fo fr ga gb gb-eng gb-nir gb-sct gb-wls gd ge gf gg gh gi gl gm gn gp gq gr gs gt gu gw gy hk hm hn hr ht hu ic id ie il im in io iq ir is it je jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md me mf mg mh mk ml mm mn mo mp mq mr ms mt mu mv mw mx my mz na nc ne nf ng ni nl no np nr nu nz om pa pc pe pf pg ph pk pl pm pn pr ps pt pw py qa re ro rs ru rw sa sb sc sd se sg sh sh-ac sh-hl sh-ta si sj sk sl sm sn so sr ss st sv sx sy sz tc td tf tg th tj tk tl tm tn to tr tt tv tw tz ua ug um un us uy uz va vc ve vg vi vn vu wf ws xk ye yt za zm zw xx".split(" ");

/* 两种比例：目录名 -> 高宽比 */
const RATIOS = {"4x3": 0.75, "1x1": 1};
const RATIO_VIEWBOX = {"4x3": "0 0 640 480", "1x1": "0 0 512 512"};

/* 预览尺寸（宽度 px） */
const SCALES = [32, 40, 48, 56, 64, 80];

/* 中文名覆盖：政治表述按 ISO 3166-1 / 一个中国原则处理 */
const OVERRIDE = {
    tw: "中国台湾", hk: "中国香港", mo: "中国澳门", xk: "科索沃",
    "gb-eng": "英格兰", "gb-sct": "苏格兰", "gb-wls": "威尔士", "gb-nir": "北爱尔兰",
    /* 非 ISO 补充：组织旗 */
    arab: "阿拉伯国家联盟", asean: "东南亚国家联盟", cefta: "中欧自由贸易协定",
    eac: "东非共同体", eu: "欧洲联盟", un: "联合国", pc: "太平洋共同体",
    /* 非 ISO 补充：地区旗 */
    "es-ct": "加泰罗尼亚", "es-ga": "加利西亚", "es-pv": "巴斯克",
    ic: "加那利群岛", cp: "克利珀顿岛", dg: "迪戈加西亚岛",
    "sh-ac": "阿森松岛", "sh-hl": "圣赫勒拿", "sh-ta": "特里斯坦达库尼亚",
    xx: "未知旗帜"
};
const OVERRIDE_EN = {
    tw: "Taiwan, China", hk: "Hong Kong, China", mo: "Macao, China", xk: "Kosovo",
    "gb-eng": "England", "gb-sct": "Scotland", "gb-wls": "Wales", "gb-nir": "Northern Ireland",
    arab: "League of Arab States", asean: "Association of Southeast Asian Nations",
    cefta: "Central European Free Trade Agreement", eac: "East African Community",
    eu: "European Union", un: "United Nations", pc: "Pacific Community",
    "es-ct": "Catalonia", "es-ga": "Galicia", "es-pv": "Basque Country",
    ic: "Canary Islands", cp: "Clipperton Island", dg: "Diego Garcia",
    "sh-ac": "Ascension Island", "sh-hl": "Saint Helena", "sh-ta": "Tristan da Cunha",
    xx: "Unknown Flag"
};

let zhN = null, enN = null;
try {zhN = new Intl.DisplayNames(["zh-CN"], {type: "region"});} catch (e) { }
try {enN = new Intl.DisplayNames(["en"], {type: "region"});} catch (e) { }
function nameZh(c) {
    if (OVERRIDE[c]) return OVERRIDE[c];
    if (zhN) {try {const v = zhN.of(c.toUpperCase()); if (v) return v;} catch (e) { } }
    return c.toUpperCase();
}
function nameEn(c) {
    if (OVERRIDE_EN[c]) return OVERRIDE_EN[c];
    if (enN) {try {const v = enN.of(c.toUpperCase()); if (v) return v;} catch (e) { } }
    return c.toUpperCase();
}

/* ---------- 状态 ---------- */
let ratio = "4x3", scale = 56, q = "";
const $ = s => document.querySelector(s);
const grid = $("#grid"), countEl = $("#count");

function srcOf(code) {return `${ratio}/${code}.svg`;}
function hOf(w) {return Math.round(w * RATIOS[ratio]);}

/* 输出完整 URI；以 file:// 直接打开时无域名，退回相对路径 */
function uriOf(code) {
    const p = srcOf(code);
    if (location.protocol === "http:" || location.protocol === "https:") {
    return new URL(p, location.href).href;
    }
    return p;
}

/* 直接把复制到的完整 URI 粘进来也能搜：取末段文件名当代码 */
function normKw(raw) {
    let k = raw.trim().toLowerCase();
    if (k.includes("/") || k.includes("\\") || /\.(svg|png|webp|ai|eps|pdf)$/.test(k)) {
    k = k.split(/[?#]/)[0].replace(/[\\/]+$/, "").split(/[\\/]/).pop() || k;
    k = k.replace(/\.(svg|png|webp|ai|eps|pdf)$/, "");
    }
    return k;
}
const esc = s => s.replace(/[&<>"]/g, m => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[m]));

function render() {
    const kw = normKw(q);
    const list = CODES.filter(c => {
    if (!kw) return true;
    return c.includes(kw) || nameZh(c).toLowerCase().includes(kw) || nameEn(c).toLowerCase().includes(kw);
    });
    countEl.innerHTML = `共 <b>${list.length}</b> / ${CODES.length} 面`;
    if (!list.length) {
    grid.innerHTML = `<div class="empty">
    <span class="ico"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4.3-4.3"/></svg></span>
    没有匹配「<b>${esc(q.trim())}</b>」的旗帜<br>
    试试代码 <b>cn</b>、<b>eu</b>，或名称「日本」「Japan」，也可以直接粘贴完整的旗帜 URI
</div>`;
    return;
    }
    const w = scale, h = hOf(w);
    const rb = RATIOS[ratio] === 1 ? "r1" : "r43";
    grid.innerHTML = list.map(c => `
<div class="cell ${rb}" data-code="${c}" title="${nameZh(c)} · ${nameEn(c)}&#10;${uriOf(c)}">
    <span class="frame"><img src="${srcOf(c)}" width="${w}" height="${h}" alt="${nameZh(c)}" loading="lazy"></span>
    <div class="c">${c}</div>
    <div class="n">${nameZh(c)}</div>
</div>`).join("");
}

/* ---------- 交互：比例 / 缩放 / 搜索 ---------- */
$("#q").addEventListener("input", e => {q = e.target.value; render();});
$("#fmt").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    [...$("#fmt").children].forEach(x => x.classList.toggle("on", x === b));
    ratio = b.dataset.r; render(); paintDemo();
});
const scaleSel = $("#scale");
scaleSel.innerHTML = SCALES.map(s => `<option value="${s}"${s === 56 ? " selected" : ""}>${s} px 宽</option>`).join("");
scaleSel.addEventListener("change", e => {scale = parseInt(e.target.value, 10); render();});

grid.addEventListener("click", e => {
    const cell = e.target.closest(".cell"); if (!cell) return;
    const u = uriOf(cell.dataset.code);
    const short = u.length > 52 ? u.slice(0, 49) + "…" : u;
    copy(u, `已复制：${short}`);
});

$("#tabs").addEventListener("click", e => {
    const b = e.target.closest(".tab"); if (!b) return;
    [...$("#tabs").children].forEach(x => x.classList.toggle("on", x === b));
    document.querySelectorAll(".pane").forEach(p => p.classList.toggle("on", p.dataset.p === b.dataset.t));
});
$("#copyCode").addEventListener("click", () => {
    const pane = document.querySelector(".pane.on code");
    copy(pane.innerText || pane.textContent, "代码已复制到剪贴板");
});

/* ---------- 代码示例：含域名 / 不含域名 ---------- */
let absMode = true;
function baseP() {
    if (!absMode) return "/flags/";
    return (location.protocol === "http:" || location.protocol === "https:")
    ? location.origin + "/"
    : "https://your-domain.com/flags/";
}
function applyBase() {
    const p = baseP();
    document.querySelectorAll(".pane").forEach(el => {
    const code = el.querySelector("code");
    if (!el.dataset.raw) el.dataset.raw = code.innerHTML;   // 只保存一次原始模板
    code.innerHTML = el.dataset.raw.replace(/\{P\}/g, p);
    });
    const isHttp = location.protocol.startsWith("http");
    $("#absNote").hidden = !(absMode && !isHttp);
}
$("#uriMode").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    [...$("#uriMode").children].forEach(x => x.classList.toggle("on", x === b));
    absMode = b.dataset.m === "abs";
    applyBase();
});

function copy(text, msg) {
    const done = () => toast(msg);
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
    function fallback() {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try {document.execCommand("copy"); done();} catch (e) {toast("复制失败，请手动选择");}
    document.body.removeChild(ta);
    }
}
let tt;
function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 1900);
}

/* ---------- 比例对比演示 ---------- */
const DEMO = ["cn", "us", "gb", "jp", "br", "ch", "np", "eu"];
function paintDemo() {
    const wrap = $("#demoRow"); if (!wrap) return;
    const w = 72, h = hOf(w);
    wrap.innerHTML = DEMO.map(c => `
<div class="demo-item" title="${nameZh(c)} · ${ratio}">
    <span class="frame"><img src="${srcOf(c)}" width="${w}" height="${h}" alt="${nameZh(c)}"></span>
    <small>${c}</small>
</div>`).join("");
    const vb = $("#demoMeta");
    if (vb) vb.innerHTML = `当前：<b>${ratio}</b> · 画布 ${RATIO_VIEWBOX[ratio].split(" ").slice(2).join(" × ")} · 渲染 ${w} × ${h} px`;
}

/* ---------- 边缘函数 region-name 试玩 ---------- */
(() => {
    const inp = $("#rnCode"), out = $("#rnOut"), urlEl = $("#rnUrl"),
        prev = $("#rnPrev"), run = $("#rnRun"), langBox = $("#rnLang");
    if (!inp || !run) return;

    let lang = "zh";
    const query = () => {
        const c = inp.value.trim();
        return `region-name?code=${encodeURIComponent(c)}&lang=${lang}`;
    };
    const showUrl = () => {
        const origin = location.protocol.startsWith("http")
        ? location.origin
        : "https://your-domain.com";
        urlEl.innerHTML = `<span class="m">GET</span> ${origin}/${query()}`;
    };

    langBox.addEventListener("click", e => {
        const b = e.target.closest("button"); if (!b) return;
        [...langBox.children].forEach(x => x.classList.toggle("on", x === b));
        lang = b.dataset.l; showUrl();
    });
    inp.addEventListener("input", showUrl);
    inp.addEventListener("keydown", e => {if (e.key === "Enter") fire();});
    run.addEventListener("click", fire);

    async function fire() {
        out.textContent = "请求中…";
        prev.innerHTML = "";
        const t0 = performance.now();
        try {
            const r = await fetch(query(), {headers: {accept: "application/json"}});
            const txt = await r.text();
            let pretty = txt;
            try {pretty = JSON.stringify(JSON.parse(txt), null, 2);} catch (e) { }
            out.textContent = `HTTP ${r.status} · ${Math.round(performance.now() - t0)} ms\n\n${pretty}`;
            let data = null;
            try {data = JSON.parse(txt);} catch (e) { }
            if (data && data.ok) {
                const c = String(data.code || "").toLowerCase();
                const flag = CODES.includes(c)
                ? `<img src="4x3/${c}.svg" width="48" height="36" alt="${esc(data.name)}">`
                : "";
                prev.innerHTML = `${flag}<div class="pv-n"><b>${esc(data.name)}</b><span>${c}</span></div>`;
            }
        } catch (e) {
            out.textContent = "请求失败：" + e.message +
            "\n\n页面以 file:// 打开、或边缘函数尚未部署时无法联调，可先按下方部署说明上线后再试。";
        }
    }

    const cp = $("#copyRn");
    if (cp) cp.addEventListener("click", () => {
        const box = document.querySelector("#region .codebox code");
        copy(box.innerText || box.textContent, "示例代码已复制");
    });

    showUrl();
})();

render();
paintDemo();
applyBase();
