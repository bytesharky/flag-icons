const OVERRIDE = {
    tw: "中国台湾", hk: "中国香港", mo: "中国澳门", xk: "科索沃",
    "gb-eng": "英格兰", "gb-sct": "苏格兰", "gb-wls": "威尔士", "gb-nir": "北爱尔兰",
    arab: "阿拉伯国家联盟", asean: "东南亚国家联盟", cefta: "中欧自由贸易协定",
    eac: "东非共同体", eu: "欧洲联盟", un: "联合国", pc: "太平洋共同体",
    "es-ct": "加泰罗尼亚", "es-ga": "加利西亚", "es-pv": "巴斯克",
    ic: "加那利群岛", cp: "克利珀顿岛", dg: "迪戈加西亚岛",
    "sh-ac": "阿森松岛", "sh-hl": "圣赫勒拿", "sh-ta": "特里斯坦达库尼亚"
};
const OVERRIDE_EN = {
    tw: "Taiwan, China", hk: "Hong Kong, China", mo: "Macao, China", xk: "Kosovo",
    "gb-eng": "England", "gb-sct": "Scotland", "gb-wls": "Wales", "gb-nir": "Northern Ireland",
    arab: "League of Arab States", asean: "Association of Southeast Asian Nations",
    cefta: "Central European Free Trade Agreement", eac: "East African Community",
    eu: "European Union", un: "United Nations", pc: "Pacific Community",
    "es-ct": "Catalonia", "es-ga": "Galicia", "es-pv": "Basque Country",
    ic: "Canary Islands", cp: "Clipperton Island", dg: "Diego Garcia",
    "sh-ac": "Ascension Island", "sh-hl": "Saint Helena", "sh-ta": "Tristan da Cunha"
};

let zhN = null, enN = null;
try { zhN = new Intl.DisplayNames(["zh-CN"], { type: "region" , fallback: "none"}); } catch {}
try { enN = new Intl.DisplayNames(["en"], { type: "region", fallback: "none" }); } catch {}

function getName(code, lang) {
    const key = code.toLowerCase();
    const map = lang === "zh" ? OVERRIDE : OVERRIDE_EN;
    if (map[key]) return map[key];
    const inst = lang === "zh" ? zhN : enN;
    if (inst) {
        try {
            const v = inst.of(key.toUpperCase());
            if (v) return v;
        } catch {}
    }
    return undefined;
}

function codeToAlpha2(code) {
  const ALPHA2_MAP = {
    // ========== 非洲 ==========
    // M49 三位数字
    "012":"DZ","818":"EG","434":"LY","504":"MA","729":"SD","788":"TN","732":"EH","086":"IO","108":"BI","174":"KM",
    "262":"DJ","232":"ER","231":"ET","260":"TF","404":"KE","450":"MG","454":"MW","480":"MU","175":"YT","508":"MZ",
    "638":"RE","646":"RW","690":"SC","706":"SO","728":"SS","800":"UG","834":"TZ","894":"ZM","716":"ZW","024":"AO",
    "120":"CM","140":"CF","148":"TD","178":"CG","180":"CD","226":"GQ","266":"GA","678":"ST","072":"BW","748":"SZ",
    "426":"LS","516":"NA","710":"ZA","204":"BJ","854":"BF","132":"CV","384":"CI","270":"GM","288":"GH","324":"GN",
    "624":"GW","430":"LR","466":"ML","478":"MR","562":"NE","566":"NG","654":"SH","686":"SN","694":"SL","768":"TG",
    // alpha3 三位字母
    "DZA":"DZ","EGY":"EG","LBY":"LY","MAR":"MA","SDN":"SD","TUN":"TN","ESH":"EH","IOT":"IO","BDI":"BI","COM":"KM",
    "DJI":"DJ","ERI":"ER","ETH":"ET","ATF":"TF","KEN":"KE","MDG":"MG","MWI":"MW","MUS":"MU","MYT":"YT","MOZ":"MZ",
    "REU":"RE","RWA":"RW","SYC":"SC","SOM":"SO","SSD":"SS","UGA":"UG","TZA":"TZ","ZMB":"ZM","ZWE":"ZW","AGO":"AO",
    "CMR":"CM","CAF":"CF","TCD":"TD","COG":"CG","COD":"CD","GNQ":"GQ","GAB":"GA","STP":"ST","BWA":"BW","SWZ":"SZ",
    "LSO":"LS","NAM":"NA","ZAF":"ZA","BEN":"BJ","BFA":"BF","CPV":"CV","CIV":"CI","GMB":"GM","GHA":"GH","GIN":"GN",
    "GNB":"GW","LBR":"LR","MLI":"ML","MRT":"MR","NER":"NE","NGA":"NG","SHN":"SH","SEN":"SN","SLE":"SL","TGO":"TG",

    // ========== 美洲 ==========
    // M49 三位数字
    "660":"AI","028":"AG","533":"AW","044":"BS","052":"BB","092":"VG","136":"KY","192":"CU","531":"CW","212":"DM",
    "214":"DO","308":"GD","312":"GP","332":"HT","388":"JM","474":"MQ","500":"MS","630":"PR","652":"BL","659":"KN",
    "662":"LC","663":"MF","670":"VC","534":"SX","780":"TT","796":"TC","850":"VI","084":"BZ","188":"CR","222":"SV",
    "320":"GT","340":"HN","484":"MX","558":"NI","591":"PA","032":"AR","068":"BO","074":"BV","076":"BR","152":"CL",
    "170":"CO","218":"EC","238":"FK","254":"GF","328":"GY","600":"PY","604":"PE","239":"GS","740":"SR","858":"UY",
    "862":"VE","060":"BM","124":"CA","304":"GL","666":"PM","840":"US",
    // alpha3 三位字母
    "AIA":"AI","ATG":"AG","ABW":"AW","BHS":"BS","BRB":"BB","VGB":"VG","CYM":"KY","CUB":"CU","CUW":"CW","DMA":"DM",
    "DOM":"DO","GRD":"GD","GLP":"GP","HTI":"HT","JAM":"JM","MTQ":"MQ","MSR":"MS","PRI":"PR","BLM":"BL","KNA":"KN",
    "LCA":"LC","MAF":"MF","VCT":"VC","SXM":"SX","TTO":"TT","TCA":"TC","VIR":"VI","BLZ":"BZ","CRI":"CR","SLV":"SV",
    "GTM":"GT","HND":"HN","MEX":"MX","NIC":"NI","PAN":"PA","ARG":"AR","BOL":"BO","BVT":"BV","BRA":"BR","CHL":"CL",
    "COL":"CO","ECU":"EC","FLK":"FK","GUF":"GF","GUY":"GY","PRY":"PY","PER":"PE","SGS":"GS","SUR":"SR","URY":"UY",
    "VEN":"VE","BMU":"BM","CAN":"CA","GRL":"GL","SPM":"PM","USA":"US",

    // ========== 亚洲 ==========
    // M49 三位数字
    "010":"AQ","398":"KZ","417":"KG","762":"TJ","795":"TM","860":"UZ","156":"CN","408":"KP","392":"JP","496":"MN",
    "410":"KR","096":"BN","116":"KH","360":"ID","418":"LA","458":"MY","104":"MM","608":"PH","702":"SG","764":"TH",
    "626":"TL","704":"VN","004":"AF","050":"BD","064":"BT","356":"IN","364":"IR","462":"MV","524":"NP","586":"PK",
    "144":"LK","051":"AM","031":"AZ","048":"BH","196":"CY","268":"GE","368":"IQ","376":"IL","400":"JO","414":"KW",
    "422":"LB","512":"OM","634":"QA","682":"SA","275":"PS","760":"SY","792":"TR","784":"AE","887":"YE","158":"TW",
    // alpha3 三位字母
    "ATA":"AQ","KAZ":"KZ","KGZ":"KG","TJK":"TJ","TKM":"TM","UZB":"UZ","CHN":"CN","PRK":"KP","JPN":"JP","MNG":"MN",
    "KOR":"KR","BRN":"BN","KHM":"KH","IDN":"ID","LAO":"LA","MYS":"MY","MMR":"MM","PHL":"PH","SGP":"SG","THA":"TH",
    "TLS":"TL","VNM":"VN","AFG":"AF","BGD":"BD","BTN":"BT","IND":"IN","IRN":"IR","MDV":"MV","NPL":"NP","PAK":"PK",
    "LKA":"LK","ARM":"AM","AZE":"AZ","BHR":"BH","CYP":"CY","GEO":"GE","IRQ":"IQ","ISR":"IL","JOR":"JO","KWT":"KW",
    "LBN":"LB","OMN":"OM","QAT":"QA","SAU":"SA","PSE":"PS","SYR":"SY","TUR":"TR","ARE":"AE","YEM":"YE","TWN":"TW",

    // ========== 欧洲 ==========
    // M49 三位数字
    "112":"BY","100":"BG","203":"CZ","348":"HU","616":"PL","498":"MD","642":"RO","643":"RU","703":"SK","804":"UA",
    "248":"AX","208":"DK","233":"EE","234":"FO","246":"FI","831":"GG","352":"IS","372":"IE","833":"IM","832":"JE",
    "428":"LV","440":"LT","578":"NO","744":"SJ","752":"SE","826":"GB","008":"AL","020":"AD","070":"BA","191":"HR",
    "292":"GI","300":"GR","336":"VA","380":"IT","470":"MT","499":"ME","807":"MK","620":"PT","674":"SM","688":"RS",
    "705":"SI","724":"ES","040":"AT","056":"BE","250":"FR","276":"DE","438":"LI","442":"LU","492":"MC","528":"NL",
    "756":"CH",
    // alpha3 三位字母
    "BLR":"BY","BGR":"BG","CZE":"CZ","HUN":"HU","POL":"PL","MDA":"MD","ROU":"RO","RUS":"RU","SVK":"SK","UKR":"UA",
    "ALA":"AX","DNK":"DK","EST":"EE","FRO":"FO","FIN":"FI","GGY":"GG","ISL":"IS","IRL":"IE","IMN":"IM","JEY":"JE",
    "LVA":"LV","LTU":"LT","NOR":"NO","SJM":"SJ","SWE":"SE","GBR":"GB","ALB":"AL","AND":"AD","BIH":"BA","HRV":"HR",
    "GIB":"GI","GRC":"GR","VAT":"VA","ITA":"IT","MLT":"MT","MNE":"ME","MKD":"MK","PRT":"PT","SMR":"SM","SRB":"RS",
    "SVN":"SI","ESP":"ES","AUT":"AT","BEL":"BE","FRA":"FR","DEU":"DE","LIE":"LI","LUX":"LU","MCO":"MC","NLD":"NL",
    "CHE":"CH",

    // ========== 大洋洲 ==========
    // M49 三位数字
    "036":"AU","162":"CX","166":"CC","334":"HM","554":"NZ","574":"NF","242":"FJ","540":"NC","598":"PG","090":"SB",
    "548":"VU","316":"GU","296":"KI","584":"MH","583":"FM","520":"NR","580":"MP","585":"PW","581":"UM","016":"AS",
    "184":"CK","258":"PF","570":"NU","612":"PN","882":"WS","772":"TK","776":"TO","798":"TV","876":"WF",
    // alpha3 三位字母
    "AUS":"AU","CXR":"CX","CCK":"CC","HMD":"HM","NZL":"NZ","NFK":"NF","FJI":"FJ","NCL":"NC","PNG":"PG","SLB":"SB",
    "VUT":"VU","GUM":"GU","KIR":"KI","MHL":"MH","FSM":"FM","NRU":"NR","MNP":"MP","PLW":"PW","UMI":"UM","ASM":"AS",
    "COK":"CK","PYF":"PF","NIU":"NU","PCN":"PN","WSM":"WS","TKL":"TK","TON":"TO","TUV":"TV","WLF":"WF"
  };
  /* 入参已 lowerCase：数字码直接命中，alpha-3 需转大写后再查表 */
  return ALPHA2_MAP[code] ?? ALPHA2_MAP[code.toUpperCase()] ?? code;
}

export async function onRequestGet(context) {
    const { request } = context;
    const url = new URL(request.url);
    const code = codeToAlpha2(url.searchParams.get("code")?.toLowerCase() || "");
    const lang = (url.searchParams.get("lang")?.toLowerCase() || "en") === 'zh' ? "zh" : "en";

    const headers = {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS"
    };

    if (request.method === "OPTIONS") {
        return new Response(null, { headers });
    }

    if (!code) {
        return new Response(JSON.stringify({ ok: false, error: "缺少 code 参数" }), {
            status: 400,
            headers
        });
    }

    /* 统一回落成小写 alpha-2，与旗帜文件名保持一致 */
    const alpha2 = code.toLowerCase();
    const name = getName(alpha2, lang);
    const payload = name
    ? { ok: true, code: alpha2, lang, name }
    : { ok: false, code: alpha2, lang };

    return new Response(JSON.stringify(payload), { headers });
}
