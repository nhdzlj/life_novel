const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const PORT = process.env.PORT || 3080;
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'life-db.json');

// Ensure directories exist
[PUBLIC_DIR, UPLOADS_DIR, DATA_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Default initial seed data: "深夜胶片溯源馆" sample life chain (with Gaode Map coordinates)
const DEFAULT_DB = {
  profile: {
    name: '林深 · Lin Shen',
    birthYear: 1998,
    exhibitionTitle: '林深的时光暗房 · 人生溯源链',
    subtitle: '把散落在岁月里的随笔与光影，冲洗成一条可溯源的生命长卷。',
    prologue: '我们并非活在孤立的今天。每一个当下的顿悟、热爱与执念，沿着时间链向上摸索，都能在多年前的某个下午找到最初的伏笔。',
    avatarText: '林',
    sortOrder: 'asc'
  },
  shareConfig: {
    slug: 'linshen-1998',
    title: '林深的时光暗房 · 1998—2026 人生溯源链',
    welcomeNote: '欢迎来到我的人生胶片馆。这里记录了从 6 岁夏夜到 28 岁深夜的 6 个关键人生切片，你可以按时间链或切换到高德地图模式溯源我的足迹。',
    passcode: '',
    onlyPublic: true,
    selectedEras: [],
    views: 42,
    updatedAt: '2026-10-25 22:00'
  },
  aiConfig: {
    provider: 'builtin_free',
    apiKey: '',
    baseUrl: 'https://api.siliconflow.cn/v1/images/generations',
    model: 'Kwai-Kolors/Kolors',
    defaultStyle: 'wong_kar_wai',
    amapKey: '',
    amapSecurityCode: ''
  },
  nodes: [
    {
      id: 'node-2004-radio',
      title: '外公藤椅旁拆开的旧收音机',
      content: '那个没有空调的夏夜，院子里的老槐树上蝉鸣声震耳欲聋。外公摇着蒲扇睡着了，我偷偷拿了把十字螺丝刀，把桌角那台杂音刺啦刺啦的红灯牌收音机后盖拧了下来。\n\n借着堂屋透出的昏黄灯泡光，我第一次看见墨绿色的电路板、银色的焊点和像微缩城市一样的电容。虽然最后多出了两颗装不回去的螺丝，但当指针重新调出电台歌声的那一刻，我第一次觉得：原来藏在盒子背后的世界，比声音本身更迷人。',
      eventYear: 2004,
      eventMonth: 7,
      eventDay: 18,
      fuzzyTimeLabel: '6岁 · 老院子的盛夏夜',
      location: '湖南长沙 · 外公的小院',
      lng: 112.9388,
      lat: 28.2282,
      mood: '✨ 好奇与启蒙',
      eraTag: '童年拾遗',
      imageSource: 'AI',
      aiStyle: 'kodak_warm',
      aiStyleLabel: '柯达暖调 35mm',
      aiPrompt: '2004 Chinese courtyard summer night, warm tungsten light bulb, vintage disassembled transistor radio on wooden table, bamboo fan, nostalgic 35mm Kodak Portra 400 film photography, cinematic grain',
      imageUrl: '/api/cinema-art?seed=radio2004&style=kodak_warm&year=2004&title=' + encodeURIComponent('旧收音机与夏夜') + '&scene=courtyard_radio',
      filmFilter: 'warm',
      frameCode: 'KODAK 400 · FRAME 01A',
      isPublic: true,
      createdAt: '2026-10-12 23:15'
    },
    {
      id: 'node-2013-rain',
      title: '晚自习停电夜，走廊尽头的烛光与诗集',
      content: '高一那年秋天台风过境，晚自习上到一半整栋教学楼忽然陷入漆黑。教室里爆发出欢呼声，老师点起两根白蜡烛让大家自习。\n\n我拿着借来的半本《海子诗集》走到走廊窗边，看狂风吹得操场边的白杨树沙沙作响，远处城市的灯火在雨幕里晕开成一片琥珀色的雾。那天晚上我在草稿纸背面写下了人生第一篇真正的随笔。原来文字是可以把风声和雨声封印起来的容器。',
      eventYear: 2013,
      eventMonth: 10,
      eventDay: 14,
      fuzzyTimeLabel: '15岁 · 台风过境的晚自习',
      location: '湖南岳阳 · 县城一中四楼走廊',
      lng: 113.1289,
      lat: 29.3571,
      mood: '🌧️ 少年心事',
      eraTag: '少年求索',
      imageSource: 'AI',
      aiStyle: 'shinkai_twilight',
      aiStyleLabel: '暮色光影胶片',
      aiPrompt: 'High school corridor during power outage on a rainy autumn night, warm candlelight flickering on wooden desk, rain droplets on window glass, distant city lights blurred, cinematic moody film',
      imageUrl: '/api/cinema-art?seed=rain2013&style=shinkai_twilight&year=2013&title=' + encodeURIComponent('停电夜与走廊雨幕') + '&scene=rainy_corridor',
      filmFilter: 'cool',
      frameCode: 'FUJI 800 · FRAME 02B',
      isPublic: true,
      createdAt: '2026-10-15 22:40'
    },
    {
      id: 'node-2016-train',
      title: '绿皮火车向北：十八岁的第一次远行',
      content: '攥着皱巴巴的硬座车票和录取通知书，K字头的绿皮火车在暮色里缓缓驶离站台。车窗外熟悉的水田和丘陵一点点退后，变成北方辽阔而陌生的平原。\n\n耳机里循环着朴树的《生如夏花》，对面座位的大叔分给我一个橘子。凌晨三点火车停靠在不知名的北方小站，月台上的钠灯冷清而明亮。那一刻突然意识到，从今往后，故乡成了只有冬夏没有春秋的地方，而我的人生链条真正开始了独自延伸。',
      eventYear: 2016,
      eventMonth: 9,
      eventDay: 2,
      fuzzyTimeLabel: '18岁 · 九月北上的列车',
      location: '安徽蚌埠 · K1064次列车跨越淮河',
      lng: 117.3897,
      lat: 32.9163,
      mood: '🚂 远行与憧憬',
      eraTag: '少年求索',
      imageSource: 'AI',
      aiStyle: 'wong_kar_wai',
      aiStyleLabel: '王家卫霓虹胶片',
      aiPrompt: 'Inside a vintage green train at night, looking out the window at a lonely northern train station platform under amber sodium lights, wired earphones, Wong Kar-wai 35mm cinema aesthetic',
      imageUrl: '/api/cinema-art?seed=train2016&style=wong_kar_wai&year=2016&title=' + encodeURIComponent('十八岁北上列车') + '&scene=night_train',
      filmFilter: 'neon',
      frameCode: 'CINESTILL 800T · FRAME 03C',
      isPublic: true,
      createdAt: '2026-10-18 00:12'
    },
    {
      id: 'node-2019-code',
      title: '实验室凌晨四点的第一束光',
      content: '大三寒假留校做嵌入式和独立软件项目，空荡荡的实验楼只剩下服务器风扇的嗡鸣和电烙铁松香的味道。连续调试了三天三夜的通信协议终于在凌晨 4:12 跑通，屏幕上一行行绿色的数据流顺畅滚动起来。\n\n我推开实验室的窗户，冬日清晨的第一缕冷蓝色天光正照在结霜的操场上。忽然想起 2004 年那个拆开外公收音机的夏夜——时隔十五年，当年那个好奇盒子背后有什么的小孩，终于学会了亲手造出属于自己的盒子。',
      eventYear: 2019,
      eventMonth: 1,
      eventDay: 21,
      fuzzyTimeLabel: '21岁 · 大三寒假凌晨四点',
      location: '北京海淀 · 大学工科楼304实验室',
      lng: 116.3264,
      lat: 39.9928,
      mood: '🔥 顿悟与狂喜',
      eraTag: '旷野远行',
      imageSource: 'AI',
      aiStyle: 'deakins_moody',
      aiStyleLabel: '暗调电影叙事',
      aiPrompt: 'University electronics lab at 4am dawn, glowing computer monitor with code and oscilloscope, soldering iron, cold blue dawn light outside frosted window, cinematic anamorphic lens',
      imageUrl: '/api/cinema-art?seed=lab2019&style=deakins_moody&year=2019&title=' + encodeURIComponent('凌晨四点的实验室') + '&scene=dawn_lab',
      filmFilter: 'contrast',
      frameCode: 'VISION3 500T · FRAME 04D',
      isPublic: true,
      createdAt: '2026-10-20 21:50'
    },
    {
      id: 'node-2022-sea',
      title: '辞职看海的那三天：在潮汐里校准方向',
      content: '第一份工作干满两年后，在日复一日的会议和周报里感到了久违的麻木。提交离职信的第二天，我背着一台旧相机坐大巴去了冬季的东海渔村。\n\n十一月的海风很大，民宿老板送了我一碗热腾腾的海鲜面。我坐在防波堤的礁石上看着灰蓝色的海浪一次次拍碎成白沫，把过去两年的焦虑全部写进了随身携带的笔记本里。人生不是一条必须按部就班的流水线，停下来听听潮汐的声音，也是链条上重要的一环。',
      eventYear: 2022,
      eventMonth: 11,
      eventDay: 9,
      fuzzyTimeLabel: '24岁 · 冬日独自看海',
      location: '浙江舟山 · 东海枸杞岛防波堤',
      lng: 122.7756,
      lat: 30.7205,
      mood: '🌊 释然与重启',
      eraTag: '旷野远行',
      imageSource: 'UPLOAD',
      aiStyle: 'silver_bw',
      aiStyleLabel: '银盐纪实摄影',
      aiPrompt: 'Solitary figure sitting on coastal breakwater rocks looking at winter ocean waves under overcast dramatic sky, vintage camera and notebook, Ilford HP5 35mm film aesthetic',
      imageUrl: '/api/cinema-art?seed=sea2022&style=silver_bw&year=2022&title=' + encodeURIComponent('冬日防波堤与潮汐') + '&scene=winter_sea',
      filmFilter: 'bw',
      frameCode: 'ILFORD HP5 · FRAME 05E',
      isPublic: true,
      createdAt: '2026-10-22 19:30'
    },
    {
      id: 'node-2026-archive',
      title: '写下这座「人生记录本」，把记忆串成星河',
      content: '二十八岁的秋夜，泡了一杯热手冲咖啡，坐在书桌前整理这些年零散在备忘录、旧相册和脑海深处的记忆碎片。\n\n很多瞬间当时来不及拍照，但文字记得，情绪也记得。把它们按时间一帧帧显影、串联起来，回头望去才惊觉：原来走过的每一步都没有白费。那些童年的好奇、少年的迷茫、远行的勇气，最终都汇聚成了今晚屏幕前的我。',
      eventYear: 2026,
      eventMonth: 10,
      eventDay: 25,
      fuzzyTimeLabel: '28岁 · 2026深秋的书桌前',
      location: '上海徐汇 · 书房深夜台灯下',
      lng: 121.4369,
      lat: 31.1885,
      mood: '🌕 笃定与回响',
      eraTag: '当下回响',
      imageSource: 'AI',
      aiStyle: 'kodak_warm',
      aiStyleLabel: '柯达暖调 35mm',
      aiPrompt: 'Cozy study desk at midnight, warm vintage brass desk lamp, steaming mug of pour-over coffee, laptop displaying glowing golden timeline of life memories, film strips, 35mm cinema still',
      imageUrl: '/api/cinema-art?seed=desk2026&style=kodak_warm&year=2026&title=' + encodeURIComponent('深夜台灯与人生长卷') + '&scene=midnight_desk',
      filmFilter: 'warm',
      frameCode: 'KODAK PORTRA · FRAME 06F',
      isPublic: true,
      createdAt: '2026-10-25 21:20'
    }
  ]
};

function loadDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      return JSON.parse(JSON.stringify(DEFAULT_DB));
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    // Backfill default coordinates if missing on seed nodes
    if (Array.isArray(parsed.nodes)) {
      const coordMap = {};
      DEFAULT_DB.nodes.forEach((dn) => {
        coordMap[dn.id] = { lng: dn.lng, lat: dn.lat, location: dn.location };
      });
      let changed = false;
      parsed.nodes.forEach((n) => {
        if ((n.lng === undefined || n.lat === undefined) && coordMap[n.id]) {
          n.lng = coordMap[n.id].lng;
          n.lat = coordMap[n.id].lat;
          n.location = coordMap[n.id].location;
          changed = true;
        }
      });
      if (changed) saveDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error loading DB, using default:', err);
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function generateCinemaSvg({ seed = 'memory', style = 'kodak_warm', year = '2026', title = '记忆显影', scene = 'auto' }) {
  const hashStr = `${seed}-${title}-${year}-${style}`;
  let hash = 0;
  for (let i = 0; i < hashStr.length; i++) {
    hash = (hash << 5) - hash + hashStr.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const palettes = {
    kodak_warm: {
      bg1: '#0c0908',
      bg2: '#291811',
      bg3: '#6b3416',
      glow1: '#f59e0b',
      glow2: '#fb923c',
      accent: '#fde68a',
      silhouette: '#090605',
      grainOpacity: 0.14
    },
    wong_kar_wai: {
      bg1: '#050b0e',
      bg2: '#0f292a',
      bg3: '#4a1c17',
      glow1: '#10b981',
      glow2: '#ef4444',
      accent: '#fbbf24',
      silhouette: '#040809',
      grainOpacity: 0.18
    },
    shinkai_twilight: {
      bg1: '#060818',
      bg2: '#1b1e4b',
      bg3: '#6d284f',
      glow1: '#f472b6',
      glow2: '#60a5fa',
      accent: '#fef08a',
      silhouette: '#050611',
      grainOpacity: 0.1
    },
    deakins_moody: {
      bg1: '#04070d',
      bg2: '#0d1b2a',
      bg3: '#1b3a4b',
      glow1: '#38bdf8',
      glow2: '#f59e0b',
      accent: '#e0f2fe',
      silhouette: '#030508',
      grainOpacity: 0.15
    },
    silver_bw: {
      bg1: '#09090b',
      bg2: '#27272a',
      bg3: '#52525b',
      glow1: '#e4e4e7',
      glow2: '#a1a1aa',
      accent: '#fafafa',
      silhouette: '#050506',
      grainOpacity: 0.22
    }
  };

  const p = palettes[style] || palettes.kodak_warm;

  let sceneType = scene;
  if (sceneType === 'auto') {
    if (/海|浪|岛|水|河|湖|江|船/.test(title + seed)) sceneType = 'winter_sea';
    else if (/车|途|路|站|远行|高铁|飞|旅/.test(title + seed)) sceneType = 'night_train';
    else if (/雨|窗|夜|楼|城|街|灯/.test(title + seed)) sceneType = 'rainy_corridor';
    else if (/码|实验|电脑|工作|灯|书|写|桌/.test(title + seed)) sceneType = 'midnight_desk';
    else if (/夏|院|童年|树|风|收音机|家|山/.test(title + seed)) sceneType = 'courtyard_radio';
    else {
      const types = ['courtyard_radio', 'rainy_corridor', 'night_train', 'dawn_lab', 'winter_sea', 'midnight_desk'];
      sceneType = types[absHash % types.length];
    }
  }

  let particles = '';
  for (let i = 0; i < 28; i++) {
    const px = ((absHash * (i + 3) * 37) % 1160) + 20;
    const py = ((absHash * (i + 7) * 53) % 520) + 25;
    const pr = ((i * 7 + absHash) % 4) + 1.2;
    const pop = (((i * 13) % 6) + 2) * 0.08;
    const color = i % 3 === 0 ? p.accent : i % 2 === 0 ? p.glow1 : p.glow2;
    particles += `<circle cx="${px}" cy="${py}" r="${pr}" fill="${color}" opacity="${pop.toFixed(2)}" />`;
  }

  let bokeh = '';
  for (let i = 0; i < 6; i++) {
    const bx = 180 + ((absHash + i * 211) % 860);
    const by = 140 + ((absHash + i * 137) % 340);
    const br = 35 + ((absHash + i * 43) % 65);
    const bColor = i % 2 === 0 ? p.glow1 : p.glow2;
    bokeh += `<circle cx="${bx}" cy="${by}" r="${br}" fill="${bColor}" opacity="0.11" filter="url(#blurLg)" />`;
    bokeh += `<circle cx="${bx}" cy="${by}" r="${br * 0.45}" fill="${p.accent}" opacity="0.14" filter="url(#blurSm)" />`;
  }

  let sceneArtwork = '';
  if (sceneType === 'courtyard_radio') {
    sceneArtwork = `
      <circle cx="920" cy="150" r="42" fill="${p.accent}" opacity="0.85" filter="url(#blurSm)" />
      <circle cx="936" cy="138" r="38" fill="${p.bg2}" />
      <path d="M0,480 Q280,430 520,470 L520,675 L0,675 Z" fill="${p.silhouette}" opacity="0.85" />
      <path d="M0,120 Q180,160 340,90 Q240,210 410,230 Q220,250 110,210 Z" fill="${p.silhouette}" opacity="0.7" />
      <line x1="620" y1="0" x2="620" y2="195" stroke="${p.accent}" stroke-width="2" opacity="0.5" />
      <circle cx="620" cy="210" r="95" fill="${p.glow1}" opacity="0.24" filter="url(#blurLg)" />
      <circle cx="620" cy="210" r="14" fill="${p.accent}" />
      <rect x="0" y="515" width="1200" height="160" fill="${p.silhouette}" />
      <line x1="0" y1="515" x2="1200" y2="515" stroke="${p.glow1}" stroke-width="1.5" opacity="0.35" />
      <g transform="translate(470, 365)">
        <rect x="0" y="0" width="240" height="150" rx="12" fill="#16110e" stroke="${p.glow1}" stroke-width="2" opacity="0.95" />
        <rect x="22" y="24" width="135" height="44" rx="4" fill="#291d14" stroke="${p.accent}" stroke-width="1" opacity="0.8" />
        <line x1="35" y1="46" x2="145" y2="46" stroke="${p.glow1}" stroke-width="2" opacity="0.7" />
        <line x1="88" y1="28" x2="88" y2="64" stroke="#ef4444" stroke-width="2.5" />
        <circle cx="192" cy="46" r="18" fill="#0c0908" stroke="${p.accent}" stroke-width="1.5" opacity="0.8" />
        <circle cx="192" cy="105" r="22" fill="#0c0908" stroke="${p.glow1}" stroke-width="1.5" opacity="0.7" />
        <circle cx="65" cy="108" r="16" fill="${p.glow1}" opacity="0.45" filter="url(#blurSm)" />
        <circle cx="115" cy="108" r="14" fill="${p.glow2}" opacity="0.45" filter="url(#blurSm)" />
        <line x1="25" y1="0" x2="170" y2="-85" stroke="${p.accent}" stroke-width="3" opacity="0.6" />
      </g>
    `;
  } else if (sceneType === 'rainy_corridor') {
    sceneArtwork = `
      <g opacity="0.45">
        <rect x="120" y="290" width="75" height="260" fill="${p.silhouette}" />
        <rect x="220" y="240" width="95" height="310" fill="${p.silhouette}" />
        <rect x="350" y="310" width="110" height="240" fill="${p.silhouette}" />
        <rect x="760" y="260" width="90" height="290" fill="${p.silhouette}" />
        <rect x="880" y="220" width="110" height="330" fill="${p.silhouette}" />
      </g>
      <g stroke="${p.accent}" stroke-width="1" opacity="0.22">
        <line x1="180" y1="60" x2="140" y2="480" />
        <line x1="310" y1="40" x2="270" y2="460" />
        <line x1="460" y1="90" x2="420" y2="510" />
        <line x1="640" y1="30" x2="600" y2="450" />
        <line x1="820" y1="70" x2="780" y2="490" />
        <line x1="990" y1="50" x2="950" y2="470" />
      </g>
      <rect x="0" y="0" width="90" height="675" fill="${p.silhouette}" />
      <rect x="1110" y="0" width="90" height="675" fill="${p.silhouette}" />
      <rect x="588" y="0" width="24" height="530" fill="${p.silhouette}" opacity="0.85" />
      <rect x="0" y="265" width="1200" height="16" fill="${p.silhouette}" opacity="0.85" />
      <rect x="0" y="510" width="1200" height="165" fill="${p.silhouette}" />
      <circle cx="430" cy="405" r="110" fill="#f59e0b" opacity="0.26" filter="url(#blurLg)" />
      <rect x="422" y="435" width="16" height="75" rx="3" fill="#fef3c7" opacity="0.9" />
      <path d="M430,395 Q444,418 430,432 Q416,418 430,395 Z" fill="#fbbf24" />
      <path d="M480,508 Q540,485 600,508 Q660,485 720,508 L730,520 L470,520 Z" fill="${p.accent}" opacity="0.75" />
    `;
  } else if (sceneType === 'night_train') {
    sceneArtwork = `
      <path d="M0,430 Q400,390 800,420 T1200,405 L1200,675 L0,675 Z" fill="${p.silhouette}" opacity="0.8" />
      <g stroke="${p.silhouette}" stroke-width="5" opacity="0.75">
        <line x1="260" y1="210" x2="260" y2="450" />
        <line x1="235" y1="235" x2="285" y2="235" />
        <line x1="780" y1="230" x2="780" y2="450" />
        <line x1="755" y1="255" x2="805" y2="255" />
      </g>
      <path d="M0,245 Q260,280 520,250 Q780,290 1200,240" fill="none" stroke="${p.silhouette}" stroke-width="2" opacity="0.5" />
      <rect x="180" y="270" width="240" height="18" rx="9" fill="${p.glow1}" opacity="0.55" filter="url(#blurSm)" />
      <rect x="640" y="295" width="310" height="24" rx="12" fill="${p.glow2}" opacity="0.45" filter="url(#blurSm)" />
      <rect x="420" y="330" width="180" height="10" rx="5" fill="${p.accent}" opacity="0.7" filter="url(#blurSm)" />
      <path d="M0,0 L1200,0 L1200,675 L0,675 Z M130,85 L1070,85 Q1100,85 1100,115 L1100,485 Q1100,515 1070,515 L130,515 Q100,515 100,485 L100,115 Q100,85 130,85 Z" fill="${p.silhouette}" fill-rule="evenodd" />
      <rect x="96" y="81" width="1008" height="438" rx="32" fill="none" stroke="${p.glow1}" stroke-width="2" opacity="0.35" />
    `;
  } else if (sceneType === 'dawn_lab') {
    sceneArtwork = `
      <rect x="680" y="70" width="410" height="360" rx="6" fill="url(#skyGrad)" opacity="0.6" stroke="${p.glow1}" stroke-width="1.5" />
      <line x1="885" y1="70" x2="885" y2="430" stroke="${p.silhouette}" stroke-width="10" />
      <line x1="680" y1="250" x2="1090" y2="250" stroke="${p.silhouette}" stroke-width="10" />
      <rect x="0" y="485" width="1200" height="190" fill="${p.silhouette}" />
      <circle cx="380" cy="340" r="160" fill="${p.glow1}" opacity="0.22" filter="url(#blurLg)" />
      <rect x="210" y="210" width="340" height="215" rx="10" fill="#07131c" stroke="${p.glow1}" stroke-width="3" />
      <g stroke="${p.glow1}" stroke-width="3" opacity="0.8">
        <line x1="245" y1="255" x2="365" y2="255" />
        <line x1="245" y1="280" x2="465" y2="280" opacity="0.5" />
        <line x1="265" y1="305" x2="425" y2="305" />
        <path d="M245,365 L295,365 L315,330 L340,390 L365,345 L395,365 L510,365" fill="none" stroke="${p.accent}" stroke-width="2.5" />
      </g>
      <rect x="355" y="425" width="50" height="60" fill="#111827" />
      <rect x="300" y="478" width="160" height="10" rx="4" fill="#1f2937" />
    `;
  } else if (sceneType === 'winter_sea') {
    sceneArtwork = `
      <circle cx="600" cy="240" r="130" fill="${p.glow1}" opacity="0.25" filter="url(#blurLg)" />
      <rect x="0" y="340" width="1200" height="335" fill="${p.bg2}" opacity="0.85" />
      <path d="M0,380 Q300,360 600,380 T1200,375 L1200,675 L0,675 Z" fill="${p.bg1}" opacity="0.7" />
      <g stroke="${p.accent}" stroke-width="2" opacity="0.45">
        <line x1="510" y1="355" x2="690" y2="355" />
        <line x1="480" y1="375" x2="720" y2="375" />
        <line x1="530" y1="398" x2="670" y2="398" />
        <line x1="450" y1="425" x2="740" y2="425" opacity="0.3" />
      </g>
      <path d="M0,490 L280,455 L490,485 L680,535 L860,675 L0,675 Z" fill="${p.silhouette}" />
      <g transform="translate(410, 395)">
        <circle cx="25" cy="16" r="13" fill="${p.silhouette}" />
        <path d="M5,32 Q25,28 44,35 L52,92 L0,92 Z" fill="${p.silhouette}" />
      </g>
      <path d="M780,190 Q792,178 804,190 Q816,178 828,190" fill="none" stroke="${p.accent}" stroke-width="2" opacity="0.6" />
      <path d="M850,165 Q858,156 866,165 Q874,156 882,165" fill="none" stroke="${p.accent}" stroke-width="1.5" opacity="0.5" />
    `;
  } else {
    sceneArtwork = `
      <circle cx="380" cy="330" r="210" fill="${p.glow1}" opacity="0.28" filter="url(#blurLg)" />
      <rect x="0" y="500" width="1200" height="175" fill="${p.silhouette}" />
      <line x1="0" y1="500" x2="1200" y2="500" stroke="${p.glow1}" stroke-width="1.5" opacity="0.4" />
      <path d="M210,500 L270,500 L255,475 L225,475 Z" fill="${p.accent}" opacity="0.7" />
      <path d="M240,475 Q220,310 330,235" fill="none" stroke="${p.glow1}" stroke-width="7" opacity="0.85" />
      <path d="M295,235 L395,215 L425,270 L280,280 Z" fill="#1c140d" stroke="${p.accent}" stroke-width="2" />
      <circle cx="352" cy="272" r="18" fill="${p.accent}" opacity="0.9" filter="url(#blurSm)" />
      <path d="M460,498 Q550,472 640,498 Q730,472 820,498 L835,510 L445,510 Z" fill="${p.accent}" opacity="0.85" />
      <rect x="890" y="435" width="54" height="65" rx="6" fill="#271911" stroke="${p.glow1}" stroke-width="2" />
      <path d="M944,448 Q966,448 966,466 Q966,484 944,484" fill="none" stroke="${p.glow1}" stroke-width="4" />
      <path d="M908,420 Q900,395 918,375 M928,422 Q920,398 936,380" fill="none" stroke="${p.accent}" stroke-width="2" opacity="0.45" />
    `;
  }

  const safeTitle = String(title || '').replace(/[<>&"']/g, '').slice(0, 22);
  const safeYear = String(year || '').replace(/[<>&"']/g, '').slice(0, 12);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}" />
      <stop offset="55%" stop-color="${p.bg2}" />
      <stop offset="100%" stop-color="${p.bg3}" />
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="55%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.72" />
    </radialGradient>
    <linearGradient id="lightLeak" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${p.glow2}" stop-opacity="0.28" />
      <stop offset="22%" stop-color="${p.glow1}" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </linearGradient>
    <filter id="blurLg"><feGaussianBlur stdDeviation="42" /></filter>
    <filter id="blurSm"><feGaussianBlur stdDeviation="8" /></filter>
  </defs>
  <rect width="1200" height="675" fill="url(#skyGrad)" />
  ${bokeh}
  ${particles}
  ${sceneArtwork}
  <rect width="1200" height="675" fill="url(#lightLeak)" />
  <rect width="1200" height="675" fill="url(#vignette)" />
  <g opacity="0.78">
    <text x="52" y="58" fill="${p.accent}" font-family="monospace" font-size="15" letter-spacing="3">REC · ${safeYear} · 35MM ARCHIVE</text>
    <text x="600" y="632" fill="#fef3c7" font-family="serif" font-size="22" text-anchor="middle" letter-spacing="4" opacity="0.9">「 ${safeTitle} 」</text>
  </g>
</svg>`;
}

function httpsPostJson(urlStr, headers, payload) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const bodyData = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyData),
          ...headers
        },
        timeout: 25000
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(parsed?.error?.message || parsed?.message || `HTTP ${res.statusCode}`));
            }
          } catch (e) {
            reject(new Error(`Invalid JSON from API (status ${res.statusCode})`));
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    req.write(bodyData);
    req.end();
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  try {
    if (pathname === '/api/cinema-art' && req.method === 'GET') {
      const seed = parsedUrl.searchParams.get('seed') || 'life';
      const style = parsedUrl.searchParams.get('style') || 'kodak_warm';
      const year = parsedUrl.searchParams.get('year') || '2026';
      const title = parsedUrl.searchParams.get('title') || '时光切片';
      const scene = parsedUrl.searchParams.get('scene') || 'auto';
      const svg = generateCinemaSvg({ seed, style, year, title, scene });
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      });
      return res.end(svg);
    }

    if (pathname === '/api/data' && req.method === 'GET') {
      const db = loadDb();
      return sendJson(res, 200, db);
    }

    if (pathname === '/api/profile' && req.method === 'POST') {
      const body = await parseBody(req);
      const db = loadDb();
      db.profile = { ...db.profile, ...body };
      saveDb(db);
      return sendJson(res, 200, { ok: true, profile: db.profile });
    }

    if (pathname === '/api/nodes' && req.method === 'POST') {
      const nodeData = await parseBody(req);
      const db = loadDb();
      if (!nodeData.id) {
        nodeData.id = 'node-' + Date.now() + '-' + crypto.randomBytes(2).toString('hex');
      }
      if (!nodeData.createdAt) {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        nodeData.createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
      }
      const existingIdx = db.nodes.findIndex((n) => n.id === nodeData.id);
      if (existingIdx >= 0) {
        db.nodes[existingIdx] = { ...db.nodes[existingIdx], ...nodeData };
      } else {
        db.nodes.push(nodeData);
      }
      saveDb(db);
      return sendJson(res, 200, { ok: true, node: nodeData, nodes: db.nodes });
    }

    if (pathname.startsWith('/api/nodes/') && req.method === 'DELETE') {
      const nodeId = decodeURIComponent(pathname.replace('/api/nodes/', ''));
      const db = loadDb();
      db.nodes = db.nodes.filter((n) => n.id !== nodeId);
      saveDb(db);
      return sendJson(res, 200, { ok: true, nodes: db.nodes });
    }

    if (pathname === '/api/share' && req.method === 'POST') {
      const body = await parseBody(req);
      const db = loadDb();
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      db.shareConfig = {
        ...db.shareConfig,
        ...body,
        slug: (body.slug || db.shareConfig.slug || 'my-life-chain').trim().replace(/[^a-zA-Z0-9_-]/g, '-'),
        updatedAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
      };
      saveDb(db);
      return sendJson(res, 200, { ok: true, shareConfig: db.shareConfig });
    }

    if (pathname.startsWith('/api/share/') && req.method === 'GET') {
      const slug = decodeURIComponent(pathname.replace('/api/share/', ''));
      const passcode = parsedUrl.searchParams.get('passcode') || '';
      const db = loadDb();

      if (db.shareConfig.passcode && db.shareConfig.passcode !== passcode) {
        return sendJson(res, 403, {
          ok: false,
          requiresPasscode: true,
          title: db.shareConfig.title || db.profile.exhibitionTitle
        });
      }

      db.shareConfig.views = (db.shareConfig.views || 0) + 1;
      saveDb(db);

      let visibleNodes = db.nodes.filter((n) => n.isPublic !== false);
      if (Array.isArray(db.shareConfig.selectedEras) && db.shareConfig.selectedEras.length > 0) {
        visibleNodes = visibleNodes.filter((n) => db.shareConfig.selectedEras.includes(n.eraTag));
      }

      return sendJson(res, 200, {
        ok: true,
        requestedSlug: slug,
        profile: db.profile,
        shareConfig: {
          title: db.shareConfig.title,
          welcomeNote: db.shareConfig.welcomeNote,
          slug: db.shareConfig.slug,
          views: db.shareConfig.views,
          updatedAt: db.shareConfig.updatedAt
        },
        aiConfig: {
          amapKey: db.aiConfig?.amapKey || '',
          amapSecurityCode: db.aiConfig?.amapSecurityCode || ''
        },
        nodes: visibleNodes
      });
    }

    if (pathname === '/api/ai-config' && req.method === 'POST') {
      const body = await parseBody(req);
      const db = loadDb();
      db.aiConfig = { ...db.aiConfig, ...body };
      saveDb(db);
      return sendJson(res, 200, { ok: true, aiConfig: db.aiConfig });
    }

    if (pathname === '/api/upload' && req.method === 'POST') {
      const { dataUrl } = await parseBody(req);
      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        return sendJson(res, 400, { ok: false, error: '无效的图片数据' });
      }
      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches) {
        return sendJson(res, 400, { ok: false, error: '图片格式解析失败' });
      }
      let ext = matches[1].toLowerCase();
      if (ext === 'jpeg') ext = 'jpg';
      if (ext === 'svg+xml') ext = 'svg';
      const buffer = Buffer.from(matches[2], 'base64');
      const safeName = `upload-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeName);
      fs.writeFileSync(filePath, buffer);
      return sendJson(res, 200, { ok: true, imageUrl: `/uploads/${safeName}` });
    }

    if (pathname === '/api/ai-generate' && req.method === 'POST') {
      const { prompt, style = 'kodak_warm', title = '记忆切片', year = '2026', scene = 'auto' } = await parseBody(req);
      const db = loadDb();
      const aiCfg = db.aiConfig || {};

      if (aiCfg.provider !== 'builtin_free' && aiCfg.apiKey && aiCfg.apiKey.trim()) {
        try {
          let apiUrl = aiCfg.baseUrl || 'https://api.siliconflow.cn/v1/images/generations';
          let modelName = aiCfg.model || 'Kwai-Kolors/Kolors';
          if (aiCfg.provider === 'zhipu') {
            apiUrl = 'https://open.bigmodel.cn/api/paas/v4/images/generations';
            modelName = aiCfg.model || 'cogview-3-flash';
          } else if (aiCfg.provider === 'openai' && !aiCfg.baseUrl) {
            apiUrl = 'https://api.openai.com/v1/images/generations';
            modelName = aiCfg.model || 'dall-e-3';
          }

          const payload = {
            model: modelName,
            prompt: prompt || `${title}, ${year}, 35mm cinematic film photography`,
            image_size: '1024x576',
            size: '1024x1024'
          };

          const apiRes = await httpsPostJson(
            apiUrl,
            { Authorization: `Bearer ${aiCfg.apiKey.trim()}` },
            payload
          );

          const remoteUrl = apiRes?.data?.[0]?.url || apiRes?.images?.[0]?.url;
          if (remoteUrl) {
            return sendJson(res, 200, {
              ok: true,
              providerUsed: aiCfg.provider,
              imageUrl: remoteUrl
            });
          }
        } catch (apiErr) {
          console.warn('Custom AI API failed, falling back to built-in cinema engine:', apiErr.message);
        }
      }

      const seed = crypto.randomBytes(4).toString('hex');
      const svgContent = generateCinemaSvg({ seed, style, year, title, scene });
      const fileName = `ai-frame-${Date.now()}-${seed}.svg`;
      fs.writeFileSync(path.join(UPLOADS_DIR, fileName), svgContent, 'utf8');

      const encodedPrompt = encodeURIComponent(
        `${prompt || title}, 35mm film grain, cinematic lighting, anamorphic widescreen, masterpiece`
      );
      const externalAiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&seed=${parseInt(seed, 16) % 99999}&nologo=true`;

      return sendJson(res, 200, {
        ok: true,
        providerUsed: 'builtin_free',
        imageUrl: `/uploads/${fileName}`,
        externalAiUrl
      });
    }

    let safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    let filePath = path.join(PUBLIC_DIR, safePath);

    if (
      pathname === '/' ||
      pathname === '/studio' ||
      pathname.startsWith('/share/') ||
      !path.extname(filePath)
    ) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    }
  } catch (err) {
    console.error('Server Error:', err);
    sendJson(res, 500, { ok: false, error: err.message || 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`\n🎬 [人生记录本 · 深夜胶片溯源馆] 已启动:`);
  console.log(`   👉 展示页面 (时光博物馆 + 高德地图模式): http://localhost:${PORT}/`);
  console.log(`   👉 管理页面 (胶片剪辑室): http://localhost:${PORT}/studio`);
  console.log(`   👉 示例分享链接 (访客端): http://localhost:${PORT}/share/linshen-1998\n`);
});
