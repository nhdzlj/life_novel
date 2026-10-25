// ============================================================================
// 人生记录本 · 深夜胶片溯源馆 (Frontend Application + 高德地图足迹模式)
// ============================================================================

const AI_STYLES = [
  { id: 'kodak_warm', label: '柯达暖调 35mm', code: 'KODAK PORTRA 400', filter: 'warm', promptSuffix: 'warm 35mm Kodak Portra 400 film photography, golden tungsten glow, nostalgic grain' },
  { id: 'wong_kar_wai', label: '王家卫霓虹胶片', code: 'CINESTILL 800T', filter: 'neon', promptSuffix: 'Wong Kar-wai style 35mm cinema still, emerald green and amber neon lights, motion blur, moody atmosphere' },
  { id: 'shinkai_twilight', label: '新海诚暮色光影', code: 'FUJI VELVIA 100', filter: 'cool', promptSuffix: 'Makoto Shinkai twilight sky, purple and indigo clouds, warm window light, poetic cinematic anime film' },
  { id: 'deakins_moody', label: '暗调电影叙事', code: 'VISION3 500T', filter: 'contrast', promptSuffix: 'Roger Deakins cinematography, anamorphic lens, deep shadows, dramatic rim light, widescreen movie frame' },
  { id: 'silver_bw', label: '黑白银盐纪实', code: 'ILFORD HP5 400', filter: 'bw', promptSuffix: 'Ilford HP5 Plus 400 black and white 35mm documentary photography, rich silver gelatin contrast, timeless' }
];

const SCENE_MOTIFS = [
  { id: 'auto', label: '✨ 根据随笔自动识别意境' },
  { id: 'courtyard_radio', label: '🌙 夏夜老院 · 旧物与星光' },
  { id: 'rainy_corridor', label: '🌧️ 雨夜窗台 · 烛光与远城' },
  { id: 'night_train', label: '🚂 远行列车 · 站台与暮色' },
  { id: 'dawn_lab', label: '💻 凌晨灯火 · 屏幕与破晓' },
  { id: 'winter_sea', label: '🌊 海岸礁石 · 潮汐与远方' },
  { id: 'midnight_desk', label: '☕ 深夜书桌 · 台灯与手稿' }
];

const MOOD_OPTIONS = [
  '✨ 好奇与启蒙',
  '🌧️ 少年心事',
  '🚂 远行与憧憬',
  '🔥 顿悟与狂喜',
  '🌊 释然与重启',
  '🌕 笃定与回响',
  '🍂 怀念与温存',
  '⚡ 破局与蜕变'
];

const WRITING_PROMPTS = [
  '“那年夏天最深刻的一个声音或气味是什么？当时身边有谁？”',
  '“第一次独自离开熟悉的地方时，车窗外是什么样的景色？”',
  '“有没有哪一个深夜或清晨，你突然意识到自己长大了？”',
  '“哪一件旧物件（一本书、一部旧手机、一张车票）藏着你的一段转折？”',
  '“回望过去十年，哪一个看似不起眼的决定改变了你后来的轨迹？”'
];

// Built-in Chinese City & Landmark Coordinate Dictionary (GCJ-02 Gaode Coordinates)
const CHINA_CITY_COORDS = {
  '北京': [116.4074, 39.9042], '海淀': [116.3264, 39.9928], '上海': [121.4737, 31.2304], '徐汇': [121.4369, 31.1885],
  '广州': [113.2644, 23.1291], '深圳': [114.0579, 22.5431], '杭州': [120.1551, 30.2741], '成都': [104.0665, 30.5728],
  '武汉': [114.3054, 30.5931], '西安': [108.9398, 34.3416], '重庆': [106.5516, 29.5630], '南京': [118.7969, 32.0603],
  '天津': [117.2010, 39.0842], '苏州': [120.5853, 31.2989], '长沙': [112.9388, 28.2282], '湖南': [112.9388, 28.2282],
  '岳阳': [113.1289, 29.3571], '郑州': [113.6253, 34.7466], '青岛': [120.3826, 36.0671], '大连': [121.6147, 38.9140],
  '宁波': [121.5440, 29.8683], '厦门': [118.0894, 24.4798], '福州': [119.2965, 26.0745], '无锡': [120.3119, 31.4912],
  '合肥': [117.2272, 31.8206], '安徽': [117.2272, 31.8206], '蚌埠': [117.3897, 32.9163], '淮河': [117.3897, 32.9163],
  '昆明': [102.8329, 24.8801], '大理': [100.2257, 25.5894], '丽江': [100.2330, 26.8721], '哈尔滨': [126.5350, 45.8038],
  '济南': [117.1201, 36.6512], '佛山': [113.1214, 23.0215], '长春': [125.3235, 43.8171], '温州': [120.6994, 27.9943],
  '石家庄': [114.5149, 38.0428], '南宁': [108.3661, 22.8172], '常州': [119.9741, 31.8112], '泉州': [118.6757, 24.8741],
  '南昌': [115.8582, 28.6829], '贵阳': [106.6302, 26.6477], '太原': [112.5489, 37.8706], '烟台': [121.4479, 37.4638],
  '嘉兴': [120.7555, 30.7461], '南通': [120.8943, 31.9802], '徐州': [117.2841, 34.2058], '太湖': [120.22, 31.25],
  '珠海': [113.5767, 22.2707], '中山': [113.3928, 22.5176], '惠州': [114.4162, 23.1118], '东莞': [113.7518, 23.0207],
  '海口': [110.3119, 20.0440], '三亚': [109.5120, 18.2528], '乌鲁木齐': [87.6168, 43.8256], '拉萨': [91.1409, 29.6456],
  '兰州': [103.8343, 36.0611], '敦煌': [94.6618, 40.1421], '银川': [106.2309, 38.4872], '西宁': [101.7782, 36.6171],
  '呼和浩特': [111.7492, 40.8426], '沈阳': [123.4315, 41.8057], '舟山': [122.2072, 29.9853], '枸杞岛': [122.7756, 30.7205],
  '东海': [122.7756, 30.7205], '景德镇': [117.1784, 29.2688], '威海': [122.1204, 37.5131], '桂林': [110.2902, 25.2736],
  '洛阳': [112.4540, 34.6197], '开封': [114.3076, 34.7972], '扬州': [119.4129, 32.3942], '绍兴': [120.5802, 30.0303],
  '霸州': [116.3915, 39.1268], '廊坊': [116.6838, 39.5380], '河北': [114.5149, 38.0428], '四川': [104.0665, 30.5728],
  '香港': [114.1694, 22.3193], '澳门': [113.5439, 22.1987], '台北': [121.5654, 25.0330]
};

const state = {
  routeMode: 'showcase', // 'showcase' | 'studio' | 'share'
  shareSlug: '',
  shareUnlocked: true,
  viewLayout: 'timeline', // 'timeline' | 'map' | 'gallery'
  selectedEra: 'ALL',
  searchQuery: '',
  sortOrder: 'asc',

  // Gaode Map Theater State
  mapStyleMode: 'dark', // 'dark' (深夜胶片高德图) | 'sat' (高德卫星影像) | 'normal' (高德标准街道)
  activeMapNodeId: null,
  isPlayingTour: false,
  tourTimer: null,
  showMapPickerModal: false,

  profile: {
    name: '林深 · Lin Shen',
    birthYear: 1998,
    exhibitionTitle: '林深的时光暗房 · 人生溯源链',
    subtitle: '把散落在岁月里的随笔与光影，冲洗成一条可溯源的生命长卷。',
    prologue: '',
    sortOrder: 'asc'
  },
  shareConfig: {
    slug: 'linshen-1998',
    title: '',
    welcomeNote: '',
    passcode: '',
    onlyPublic: true,
    selectedEras: [],
    views: 1
  },
  aiConfig: {
    provider: 'builtin_free',
    apiKey: '',
    baseUrl: 'https://api.siliconflow.cn/v1/images/generations',
    model: 'Kwai-Kolors/Kolors',
    defaultStyle: 'kodak_warm',
    amapKey: '',
    amapSecurityCode: ''
  },
  nodes: [],

  editingNode: getEmptyNodeForm(),
  isGeneratingAi: false,

  lightboxNodeId: null,
  showShareModal: false,
  showProfileModal: false,
  showAiConfigModal: false,
  studioFilter: 'ALL'
};

// Leaflet Map Instances
let showcaseMapInstance = null;
let showcaseTileLayer = null;
let showcaseLabelLayer = null;
let showcaseMarkersMap = {};
let pickerMapInstance = null;
let pickerMarker = null;

function getEmptyNodeForm() {
  return {
    id: '',
    title: '',
    content: '',
    eventYear: new Date().getFullYear(),
    eventMonth: new Date().getMonth() + 1,
    eventDay: '',
    fuzzyTimeLabel: '',
    location: '',
    lng: 121.4737,
    lat: 31.2304,
    mood: '✨ 好奇与启蒙',
    eraTag: '当下回响',
    imageSource: 'AI',
    aiStyle: 'kodak_warm',
    aiStyleLabel: '柯达暖调 35mm',
    sceneMotif: 'auto',
    aiPrompt: '',
    imageUrl: '/api/cinema-art?seed=newframe&style=kodak_warm&year=2026&title=' + encodeURIComponent('待显影的记忆切片'),
    filmFilter: 'warm',
    frameCode: 'KODAK 400 · FRAME NEW',
    isPublic: true
  };
}

function inferCoordsFromLocation(locText, fallbackIndex = 0) {
  const str = String(locText || '');
  for (const [city, coords] of Object.entries(CHINA_CITY_COORDS)) {
    if (str.includes(city)) {
      return { lng: coords[0], lat: coords[1], matchedCity: city };
    }
  }
  const defaults = [
    [112.9388, 28.2282],
    [114.3054, 30.5931],
    [116.4074, 39.9042],
    [120.1551, 30.2741],
    [121.4737, 31.2304]
  ];
  const pick = defaults[fallbackIndex % defaults.length];
  return { lng: pick[0], lat: pick[1], matchedCity: null };
}

function getNodeCoords(node, idx = 0) {
  const lng = Number(node.lng);
  const lat = Number(node.lat);
  if (!isNaN(lng) && !isNaN(lat) && lng !== 0 && lat !== 0) {
    return { lng, lat };
  }
  return inferCoordsFromLocation(node.location, idx);
}

function computeAge(eventYear) {
  const birth = Number(state.profile.birthYear) || 1998;
  const yr = Number(eventYear) || new Date().getFullYear();
  return Math.max(0, yr - birth);
}

function inferEraByAge(age) {
  if (age <= 12) return '童年拾遗';
  if (age <= 18) return '少年求索';
  if (age <= 25) return '旷野远行';
  return '当下回响';
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast-msg';
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 250);
  }, 3200);
}

function getSortedNodes(nodesList, order = state.sortOrder) {
  const copy = [...nodesList];
  copy.sort((a, b) => {
    const ya = Number(a.eventYear) || 0;
    const yb = Number(b.eventYear) || 0;
    if (ya !== yb) return order === 'asc' ? ya - yb : yb - ya;
    const ma = Number(a.eventMonth) || 1;
    const mb = Number(b.eventMonth) || 1;
    if (ma !== mb) return order === 'asc' ? ma - mb : mb - ma;
    const da = Number(a.eventDay) || 1;
    const db = Number(b.eventDay) || 1;
    return order === 'asc' ? da - db : db - da;
  });
  return copy;
}

function parseRoute() {
  const p = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  if (p.startsWith('/share/')) {
    state.routeMode = 'share';
    state.shareSlug = decodeURIComponent(p.replace('/share/', '').replace(/\/$/, ''));
  } else if (params.get('share')) {
    state.routeMode = 'share';
    state.shareSlug = params.get('share');
  } else if (p === '/studio' || params.get('mode') === 'studio') {
    state.routeMode = 'studio';
  } else {
    state.routeMode = 'showcase';
  }
}

async function initApp() {
  parseRoute();
  window.addEventListener('popstate', () => {
    stopMapTour();
    parseRoute();
    loadInitialData();
  });
  await loadInitialData();
}

async function loadInitialData(passcodeAttempt = '') {
  try {
    if (state.routeMode === 'share') {
      const res = await fetch(`/api/share/${encodeURIComponent(state.shareSlug)}?passcode=${encodeURIComponent(passcodeAttempt)}`);
      const data = await res.json();
      if (res.status === 403 && data.requiresPasscode) {
        state.shareUnlocked = false;
        state.shareConfig.title = data.title || '受保护的人生溯源链';
        render();
        return;
      }
      if (data.ok) {
        state.shareUnlocked = true;
        state.profile = data.profile || state.profile;
        state.shareConfig = { ...state.shareConfig, ...data.shareConfig };
        if (data.aiConfig) state.aiConfig = { ...state.aiConfig, ...data.aiConfig };
        state.nodes = data.nodes || [];
        state.sortOrder = state.profile.sortOrder || 'asc';
      }
    } else {
      const res = await fetch('/api/data');
      const data = await res.json();
      state.profile = data.profile || state.profile;
      state.shareConfig = data.shareConfig || state.shareConfig;
      state.aiConfig = data.aiConfig || state.aiConfig;
      state.nodes = data.nodes || [];
      state.sortOrder = state.profile.sortOrder || 'asc';
    }
  } catch (err) {
    console.error('Failed to load data:', err);
    showToast('⚠️ 数据加载失败，请确认本地服务已运行');
  }
  render();
}

function switchMode(newMode) {
  stopMapTour();
  state.routeMode = newMode;
  const targetUrl = newMode === 'studio' ? '/studio' : '/';
  window.history.pushState({}, '', targetUrl);
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// RENDER ENGINE
// ============================================================================
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  if (state.routeMode === 'share' && !state.shareUnlocked) {
    app.innerHTML = renderPasscodeLockScreen();
    return;
  }

  let html = '';

  if (state.routeMode === 'share') {
    html += `
      <div class="visitor-banner">
        <span>🎞️ 您正在浏览 <strong>${escapeHtml(state.profile.name)}</strong> 的公开人生溯源链长卷 · 累计第 ${state.shareConfig.views || 1} 位访客</span>
        <a href="/studio" class="btn btn-sm btn-ghost-amber" onclick="event.preventDefault(); switchMode('studio')">🛠️ 进入管理工作台</a>
      </div>
    `;
  }

  html += renderTopNav();

  if (state.routeMode === 'studio') {
    html += renderStudioPage();
  } else {
    html += renderShowcasePage();
  }

  if (state.lightboxNodeId) {
    html += renderLightboxModal();
  }
  if (state.showShareModal) {
    html += renderShareModal();
  }
  if (state.showProfileModal) {
    html += renderProfileModal();
  }
  if (state.showAiConfigModal) {
    html += renderAiConfigModal();
  }
  if (state.showMapPickerModal) {
    html += renderMapPickerModal();
  }

  app.innerHTML = html;

  // Initialize Gaode Map if currently in Map Mode or Map Picker Modal
  if (state.routeMode !== 'studio' && state.viewLayout === 'map') {
    setTimeout(() => initShowcaseGaodeMap(), 40);
  }
  if (state.showMapPickerModal) {
    setTimeout(() => initStudioPickerMap(), 40);
  }
}

function renderPasscodeLockScreen() {
  return `
    <div class="modal-backdrop">
      <div class="modal-card" style="max-width: 440px; text-align: center;">
        <div class="hero-badge" style="margin-bottom: 1rem;">🔒 PRIVATE ARCHIVE · 私密放映室</div>
        <h2 style="font-family: var(--font-serif); font-size: 1.45rem; color: var(--amber-pale); margin-bottom: 0.65rem;">
          ${escapeHtml(state.shareConfig.title || '人生溯源链')}
        </h2>
        <p style="font-size: 0.86rem; color: var(--text-secondary); margin-bottom: 1.4rem;">
          主人为这条人生溯源链设置了访问暗号，请输入暗号开启放映：
        </p>
        <input
          type="password"
          id="passcode-unlock-input"
          class="form-input"
          placeholder="输入访问暗号..."
          style="text-align: center; margin-bottom: 1rem;"
          onkeydown="if(event.key==='Enter') submitSharePasscode()"
        />
        <button class="btn btn-amber" style="width: 100%; justify-content: center;" onclick="submitSharePasscode()">
          📽️ 解锁并进入人生溯源馆
        </button>
      </div>
    </div>
  `;
}

window.submitSharePasscode = async function () {
  const input = document.getElementById('passcode-unlock-input');
  const code = input ? input.value.trim() : '';
  await loadInitialData(code);
  if (!state.shareUnlocked) {
    showToast('❌ 访问暗号不正确，请重试');
  }
};

function renderTopNav() {
  const isShare = state.routeMode === 'share';
  return `
    <header class="top-nav">
      <div class="brand-group" onclick="switchMode('showcase')">
        <div class="brand-reel">🎞️</div>
        <div>
          <div class="brand-title">${escapeHtml(state.profile.exhibitionTitle || '人生记录本 · 深夜胶片馆')}</div>
          <div class="brand-sub">LIFE PROVENANCE ARCHIVE · 35MM & AMAP FOOTPRINTS</div>
        </div>
      </div>

      <div class="nav-actions">
        ${
          !isShare
            ? `
          <div class="mode-tabs">
            <button class="mode-tab ${state.routeMode === 'showcase' ? 'active' : ''}" onclick="switchMode('showcase')">
              🌌 展示页面 (时间链 & 高德地图)
            </button>
            <button class="mode-tab ${state.routeMode === 'studio' ? 'active' : ''}" onclick="switchMode('studio')">
              🎬 管理页面 (编辑与配图)
            </button>
          </div>
          <button class="btn btn-amber" onclick="openShareModal()">
            🔗 分享溯源链
          </button>
        `
            : `
          <button class="btn btn-ghost-amber" onclick="copyCurrentShareUrl()">
            📋 复制此溯源链链接
          </button>
        `
        }
      </div>
    </header>
  `;
}

// ============================================================================
// 1. 展示页面 (SHOWCASE PAGE · 流光时间链 / 高德足迹地图 / 底片画廊)
// ============================================================================
function getFilteredShowcaseNodes() {
  const baseNodes = state.routeMode === 'share'
    ? state.nodes.filter((n) => n.isPublic !== false)
    : state.nodes;

  return getSortedNodes(baseNodes, state.sortOrder).filter((node) => {
    if (state.selectedEra !== 'ALL' && node.eraTag !== state.selectedEra) return false;
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.trim().toLowerCase();
      const hay = `${node.title} ${node.content} ${node.location} ${node.fuzzyTimeLabel} ${node.eventYear}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderShowcasePage() {
  const baseNodes = state.routeMode === 'share'
    ? state.nodes.filter((n) => n.isPublic !== false)
    : state.nodes;

  const sortedAll = getSortedNodes(baseNodes, 'asc');
  const maxYear = sortedAll.length ? sortedAll[sortedAll.length - 1].eventYear : new Date().getFullYear();
  const spanYears = Math.max(1, maxYear - state.profile.birthYear);
  const aiCount = baseNodes.filter((n) => n.imageSource === 'AI').length;
  const uploadCount = baseNodes.length - aiCount;
  const uniqueCities = new Set(baseNodes.map((n) => (n.location || '').split('·')[0].trim()).filter(Boolean)).size;

  const eras = ['ALL', '童年拾遗', '少年求索', '旷野远行', '当下回响'];
  const filteredNodes = getFilteredShowcaseNodes();

  const displayTitle = state.routeMode === 'share' && state.shareConfig.title
    ? state.shareConfig.title
    : state.profile.exhibitionTitle;

  const displayPrologue = state.routeMode === 'share' && state.shareConfig.welcomeNote
    ? state.shareConfig.welcomeNote
    : state.profile.prologue;

  return `
    <section class="hero-section">
      <div class="hero-badge">
        <span>📽️ ARCHIVE CURATOR · ${escapeHtml(state.profile.name)} (生于 ${state.profile.birthYear})</span>
      </div>
      <h1 class="hero-title">${escapeHtml(displayTitle)}</h1>
      <p class="hero-subtitle">${escapeHtml(state.profile.subtitle)}</p>

      ${
        displayPrologue
          ? `<div class="hero-prologue">“${escapeHtml(displayPrologue)}”</div>`
          : ''
      }

      <div class="metrics-bar">
        <div class="metric-chip">
          <div class="metric-val">${spanYears} 载</div>
          <div class="metric-label">生命跨度 (${state.profile.birthYear} — ${maxYear})</div>
        </div>
        <div class="metric-chip">
          <div class="metric-val">${baseNodes.length} 帧</div>
          <div class="metric-label">已显影人生切片</div>
        </div>
        <div class="metric-chip">
          <div class="metric-val">${uniqueCities} 城</div>
          <div class="metric-label">高德地图足迹坐标</div>
        </div>
        <div class="metric-chip">
          <div class="metric-val">${aiCount} / ${uploadCount}</div>
          <div class="metric-label">AI 记忆显影 / 实拍影像</div>
        </div>
      </div>
    </section>

    <!-- Era & View Control Toolbar (含高德地图模式切换) -->
    <div class="toolbar-container">
      <div class="toolbar-box">
        <div class="era-pills">
          ${eras
            .map(
              (era) => `
            <button
              class="era-pill ${state.selectedEra === era ? 'active' : ''}"
              onclick="setEraFilter('${era}')"
            >
              ${era === 'ALL' ? '🎞️ 全部阶段' : era}
            </button>
          `
            )
            .join('')}
        </div>

        <div class="toolbar-controls">
          <input
            type="text"
            class="search-input"
            placeholder="🔍 搜索年份、城市或随笔..."
            value="${escapeHtml(state.searchQuery)}"
            oninput="updateSearchQuery(this.value)"
          />

          <button class="btn btn-sm" onclick="toggleTimelineSortOrder()" title="切换时间流向">
            ${state.sortOrder === 'asc' ? '⏳ 正序 (童年→今)' : '🕰️ 倒序 (今→童年)'}
          </button>

          <!-- Three-Mode View Switcher: 流光时间链 / 高德地图模式 / 底片画廊 -->
          <div class="mode-tabs">
            <button
              class="mode-tab ${state.viewLayout === 'timeline' ? 'active' : ''}"
              onclick="setViewLayout('timeline')"
            >
              ✨ 流光时间链
            </button>
            <button
              class="mode-tab ${state.viewLayout === 'map' ? 'active' : ''}"
              onclick="setViewLayout('map')"
            >
              🗺️ 高德地图模式
            </button>
            <button
              class="mode-tab ${state.viewLayout === 'gallery' ? 'active' : ''}"
              onclick="setViewLayout('gallery')"
            >
              🖼️ 底片画廊
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    ${
      filteredNodes.length === 0
        ? `
      <div style="text-align: center; padding: 4rem 1.5rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">暂无符合筛选条件的人生切片</p>
        ${
          state.routeMode !== 'share'
            ? `<button class="btn btn-amber" onclick="switchMode('studio')">✍️ 去管理页写下第一篇人生随笔</button>`
            : ''
        }
      </div>
    `
        : state.viewLayout === 'timeline'
        ? renderTimelineChain(filteredNodes)
        : state.viewLayout === 'map'
        ? renderGaodeMapTheater(filteredNodes)
        : renderGalleryGrid(filteredNodes)
    }
  `;
}

function renderTimelineChain(nodes) {
  return `
    <div class="timeline-wrapper">
      <div class="timeline-spine"></div>
      ${nodes
        .map((node, index) => {
          const age = computeAge(node.eventYear);
          const dateStr = `${node.eventYear}${node.eventMonth ? '.' + String(node.eventMonth).padStart(2, '0') : ''}${node.eventDay ? '.' + String(node.eventDay).padStart(2, '0') : ''}`;
          return `
            <div class="timeline-item">
              <div class="timeline-node-dot">
                <div class="node-ring"></div>
                <div class="node-year-pill">${node.eventYear} · ${age}岁</div>
              </div>
              <div class="timeline-card-slot">
                <div class="timeline-connector"></div>
                ${renderFilmCard(node, index, age, dateStr)}
              </div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderGalleryGrid(nodes) {
  return `
    <div class="gallery-grid">
      ${nodes
        .map((node, index) => {
          const age = computeAge(node.eventYear);
          const dateStr = `${node.eventYear}${node.eventMonth ? '.' + String(node.eventMonth).padStart(2, '0') : ''}`;
          return renderFilmCard(node, index, age, dateStr);
        })
        .join('')}
    </div>
  `;
}

// ============================================================================
// 🗺️ 高德地图模式 (GAODE MAP FOOTPRINT THEATER)
// ============================================================================
function renderGaodeMapTheater(nodes) {
  return `
    <div class="map-theater-wrapper">
      <!-- Left: Interactive Gaode Map Stage -->
      <div class="map-stage-box">
        <div class="map-top-hud">
          <div class="map-hud-title">
            <span>🧭 高德地图 · 人生足迹溯源链 (AutoNavi GCJ-02)</span>
          </div>

          <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
            <button
              class="btn btn-sm ${state.isPlayingTour ? 'btn-danger' : 'btn-amber'}"
              onclick="toggleMapTour()"
            >
              ${state.isPlayingTour ? '⏹️ 停止巡航' : '▶️ 巡航播放人生轨迹'}
            </button>
            <button class="btn btn-sm" onclick="fitAllMapStops()">
              🌍 全局足迹视野
            </button>
            <select
              class="form-select"
              style="width:auto; padding:0.28rem 0.65rem; font-size:0.76rem;"
              onchange="changeMapStyleMode(this.value)"
            >
              <option value="dark" ${state.mapStyleMode === 'dark' ? 'selected' : ''}>🌌 高德深夜胶片底图</option>
              <option value="sat" ${state.mapStyleMode === 'sat' ? 'selected' : ''}>🛰️ 高德卫星影像底图</option>
              <option value="normal" ${state.mapStyleMode === 'normal' ? 'selected' : ''}>🗺️ 高德标准街道底图</option>
            </select>
          </div>
        </div>

        <div id="amap-showcase-canvas" class="map-canvas-el"></div>
      </div>

      <!-- Right: Chronological Footprint Stops Dock -->
      <div class="map-stops-dock">
        <div class="panel-title" style="margin-bottom:0.85rem; font-size:1rem;">
          <span>📍 人生足迹坐标链 (${nodes.length} 站)</span>
          <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted);">点击站点飞行定位</span>
        </div>

        <div class="map-stops-list">
          ${nodes
            .map((node, idx) => {
              const age = computeAge(node.eventYear);
              const coords = getNodeCoords(node, idx);
              const isActive = state.activeMapNodeId === node.id;
              return `
                <div
                  class="map-stop-item ${isActive ? 'active' : ''}"
                  onclick="focusMapNode('${escapeHtml(node.id)}')"
                >
                  <div class="stop-index-circle">${String(idx + 1).padStart(2, '0')}</div>
                  <div style="flex:1; min-width:0;">
                    <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.72rem; color:var(--amber-bright);">
                      <span>${node.eventYear}年 · ${age}岁</span>
                      <span>${coords.lng.toFixed(2)}°E, ${coords.lat.toFixed(2)}°N</span>
                    </div>
                    <div style="font-family:var(--font-serif); font-size:0.92rem; color:#fff; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin:0.15rem 0;">
                      ${escapeHtml(node.title)}
                    </div>
                    <div style="font-size:0.76rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      📍 ${escapeHtml(node.location || '未标注地点')}
                    </div>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function initShowcaseGaodeMap() {
  const container = document.getElementById('amap-showcase-canvas');
  if (!container || typeof L === 'undefined') return;

  if (showcaseMapInstance) {
    showcaseMapInstance.remove();
    showcaseMapInstance = null;
  }
  showcaseMarkersMap = {};

  const nodes = getFilteredShowcaseNodes();
  const map = L.map(container, {
    center: [32.5, 115.5],
    zoom: 5,
    zoomControl: true,
    attributionControl: false
  });
  showcaseMapInstance = map;

  applyGaodeTileLayer(map, state.mapStyleMode);

  const latlngs = [];
  nodes.forEach((node, idx) => {
    const { lng, lat } = getNodeCoords(node, idx);
    const latlng = [lat, lng];
    latlngs.push(latlng);

    const age = computeAge(node.eventYear);
    const stepNo = String(idx + 1).padStart(2, '0');
    const shortCity = (node.location || `${node.eventYear}`).split('·')[0].trim();

    const icon = L.divIcon({
      className: 'amap-life-pin',
      html: `
        <div class="amap-pin-badge">#${stepNo} · ${node.eventYear} (${age}岁) · ${escapeHtml(shortCity)}</div>
        <div class="amap-pin-dot"></div>
      `,
      iconSize: [140, 48],
      iconAnchor: [70, 32],
      popupAnchor: [0, -28]
    });

    const popupHtml = `
      <div class="map-popup-card">
        <img src="${escapeHtml(node.imageUrl)}" alt="${escapeHtml(node.title)}" class="${node.filmFilter ? 'filter-' + node.filmFilter : ''}" />
        <div class="map-popup-body">
          <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--amber-bright); margin-bottom:0.25rem;">
            #${stepNo} · ${node.eventYear}年 (${age}岁) · 📍 ${escapeHtml(node.location || '')}
          </div>
          <h4 style="font-family:var(--font-serif); font-size:1rem; color:#fff; margin-bottom:0.4rem;">
            ${escapeHtml(node.title)}
          </h4>
          <p style="font-size:0.8rem; color:#cbd5e1; line-height:1.55; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:0.65rem;">
            ${escapeHtml(node.content)}
          </p>
          <button class="btn btn-sm btn-amber" style="width:100%; justify-content:center;" onclick="openLightbox('${escapeHtml(node.id)}')">
            📽️ 放映此帧完整随笔
          </button>
        </div>
      </div>
    `;

    const marker = L.marker(latlng, { icon }).addTo(map);
    marker.bindPopup(popupHtml, { maxWidth: 290 });
    marker.on('click', () => {
      state.activeMapNodeId = node.id;
      highlightActiveStopInDock(node.id);
    });
    showcaseMarkersMap[node.id] = { marker, latlng, node };
  });

  // Draw glowing trajectory line connecting the life nodes across Gaode Map
  if (latlngs.length > 1) {
    // Outer amber glow line
    L.polyline(latlngs, {
      color: '#f59e0b',
      weight: 6,
      opacity: 0.32,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Inner bright dashed trajectory chain
    L.polyline(latlngs, {
      color: '#fde68a',
      weight: 2.5,
      opacity: 0.92,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(map);
  }

  if (latlngs.length > 0) {
    const bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds, { padding: [65, 65], maxZoom: 11 });
  }
}

function applyGaodeTileLayer(map, mode) {
  if (showcaseTileLayer) {
    map.removeLayer(showcaseTileLayer);
    showcaseTileLayer = null;
  }
  if (showcaseLabelLayer) {
    map.removeLayer(showcaseLabelLayer);
    showcaseLabelLayer = null;
  }

  if (mode === 'sat') {
    // Gaode AutoNavi Satellite Imagery + Road & City Labels Overlay
    showcaseTileLayer = L.tileLayer(
      'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      { subdomains: ['1', '2', '3', '4'], maxZoom: 18 }
    ).addTo(map);
    showcaseLabelLayer = L.tileLayer(
      'https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
      { subdomains: ['1', '2', '3', '4'], maxZoom: 18 }
    ).addTo(map);
  } else {
    // Gaode AutoNavi Official Vector Map (with Dark Cinema Filter when mode === 'dark')
    showcaseTileLayer = L.tileLayer(
      'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      {
        subdomains: ['1', '2', '3', '4'],
        maxZoom: 18,
        className: mode === 'dark' ? 'amap-tile-dark' : ''
      }
    ).addTo(map);
  }
}

function highlightActiveStopInDock(nodeId) {
  document.querySelectorAll('.map-stop-item').forEach((el) => {
    el.classList.remove('active');
  });
  const items = document.querySelectorAll('.map-stop-item');
  const nodes = getFilteredShowcaseNodes();
  const idx = nodes.findIndex((n) => n.id === nodeId);
  if (idx >= 0 && items[idx]) {
    items[idx].classList.add('active');
    items[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

window.focusMapNode = function (nodeId) {
  const entry = showcaseMarkersMap[nodeId];
  if (!entry || !showcaseMapInstance) return;
  state.activeMapNodeId = nodeId;
  highlightActiveStopInDock(nodeId);
  showcaseMapInstance.flyTo(entry.latlng, 10, { duration: 1.35 });
  setTimeout(() => {
    entry.marker.openPopup();
  }, 600);
};

window.fitAllMapStops = function () {
  stopMapTour();
  if (!showcaseMapInstance) return;
  const coords = Object.values(showcaseMarkersMap).map((m) => m.latlng);
  if (coords.length > 0) {
    showcaseMapInstance.flyToBounds(L.latLngBounds(coords), { padding: [65, 65], maxZoom: 11, duration: 1.2 });
  }
};

window.changeMapStyleMode = function (newMode) {
  state.mapStyleMode = newMode;
  if (showcaseMapInstance) {
    applyGaodeTileLayer(showcaseMapInstance, newMode);
  }
};

window.toggleMapTour = function () {
  if (state.isPlayingTour) {
    stopMapTour();
    render();
    return;
  }
  const nodes = getFilteredShowcaseNodes();
  if (!nodes.length) return;

  state.isPlayingTour = true;
  let stepIndex = 0;
  showToast('▶️ 开始巡航播放人生足迹链...');

  const playStep = () => {
    if (!state.isPlayingTour || stepIndex >= nodes.length) {
      stopMapTour();
      showToast('✨ 人生足迹巡航播放完毕');
      return;
    }
    const node = nodes[stepIndex];
    window.focusMapNode(node.id);
    stepIndex++;
    state.tourTimer = setTimeout(playStep, 3400);
  };

  playStep();
};

function stopMapTour() {
  state.isPlayingTour = false;
  if (state.tourTimer) {
    clearTimeout(state.tourTimer);
    state.tourTimer = null;
  }
}

function renderFilmCard(node, index, age, dateStr) {
  const filterClass = node.filmFilter ? `filter-${node.filmFilter}` : '';
  const frameNo = String(index + 1).padStart(2, '0');
  const frameHeader = node.frameCode || `35MM ARCHIVE · FRAME #${frameNo}`;

  return `
    <article class="film-card" onclick="openLightbox('${escapeHtml(node.id)}')">
      <div class="film-strip-bar">
        <div class="sprocket-holes">
          <span class="sprocket-hole"></span>
          <span class="sprocket-hole"></span>
          <span class="sprocket-hole"></span>
        </div>
        <span>◀ ${escapeHtml(frameHeader)} ▶</span>
        <div class="sprocket-holes">
          <span class="sprocket-hole"></span>
          <span class="sprocket-hole"></span>
          <span class="sprocket-hole"></span>
        </div>
      </div>

      <div class="film-media-wrap">
        <img
          src="${escapeHtml(node.imageUrl)}"
          alt="${escapeHtml(node.title)}"
          class="${filterClass}"
          loading="lazy"
        />
        <div class="media-overlay-badges">
          <div class="badge-row-top">
            <span class="source-badge ${node.imageSource === 'AI' ? 'ai' : 'upload'}">
              ${node.imageSource === 'AI' ? `✨ AI 记忆显影 · ${escapeHtml(node.aiStyleLabel || '35mm胶片')}` : '📷 岁月实拍影像'}
            </span>
            <span class="age-stage-badge">${age} 岁 · ${escapeHtml(node.eraTag || inferEraByAge(age))}</span>
          </div>
          <div class="badge-row-bottom">
            <span>${node.location ? `📍 ${escapeHtml(node.location)}` : ''}</span>
            <span>${escapeHtml(node.mood || '')}</span>
          </div>
        </div>
      </div>

      <div class="film-card-body">
        <div class="card-fuzzy-time">
          <span>⏳ ${escapeHtml(node.fuzzyTimeLabel || `${node.eventYear}年 · ${age}岁那年`)}</span>
          ${node.isPublic === false ? `<span style="color:#f87171; font-size:0.7rem;">🔒 私密珍藏</span>` : ''}
        </div>
        <h3 class="card-title">${escapeHtml(node.title)}</h3>
        <div class="card-essay">${escapeHtml(node.content)}</div>

        <div class="card-footer-meta">
          <span>发生于 ${escapeHtml(dateStr)} (${age}岁)</span>
          <span>追记于 ${escapeHtml(node.createdAt || '2026.10')} · 点击放映详情 ↗</span>
        </div>
      </div>
    </article>
  `;
}

// ============================================================================
// 2. 管理页面 (STUDIO PAGE · 胶片剪辑与高德坐标标注工作台)
// ============================================================================
function renderStudioPage() {
  const f = state.editingNode;
  const previewAge = computeAge(f.eventYear);
  const shareUrl = `${window.location.origin}/share/${encodeURIComponent(state.shareConfig.slug || 'linshen-1998')}`;

  const sortedNodes = getSortedNodes(state.nodes, 'asc').filter((n) => {
    if (state.studioFilter === 'PUBLIC') return n.isPublic !== false;
    if (state.studioFilter === 'PRIVATE') return n.isPublic === false;
    return true;
  });

  return `
    <div class="studio-container">
      <div class="studio-header-card">
        <div>
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--amber-bright); letter-spacing:0.12em;">
            🎬 CREATOR DARKROOM STUDIO · 人生素材剪辑室
          </div>
          <h2 style="font-family:var(--font-serif); font-size:1.5rem; color:#fff; margin:0.25rem 0;">
            管理你的人生记录、高德足迹坐标与公开溯源链
          </h2>
          <p style="font-size:0.86rem; color:var(--text-secondary);">
            当前公开分享链接：<a href="${shareUrl}" target="_blank" style="color:var(--amber-bright); text-decoration:underline; font-family:var(--font-mono);">${shareUrl}</a>
            （已累计访问 ${state.shareConfig.views || 0} 次）
          </p>
        </div>

        <div style="display:flex; gap:0.65rem; flex-wrap:wrap;">
          <button class="btn" onclick="openProfileModal()">👤 档案与展馆导语</button>
          <button class="btn" onclick="openAiConfigModal()">
            ⚙️ AI 与高德地图设置
          </button>
          <button class="btn btn-amber" onclick="openShareModal()">
            🔗 点击分享 · 生成溯源链接
          </button>
        </div>
      </div>

      <div class="studio-grid">
        <!-- LEFT PANEL: Create / Edit Life Essay, Coordinates & Visual Pairing -->
        <div class="studio-panel">
          <div class="panel-title">
            <span>${f.id ? '✏️ 编辑人生切片' : '✍️ 记录新的人生切片'}</span>
            ${
              f.id
                ? `<button class="btn btn-sm" onclick="resetEditorForm()">+ 新建空白随笔</button>`
                : `<button class="btn btn-sm btn-ghost-amber" onclick="insertRandomPrompt()">💡 随机回忆灵感</button>`
            }
          </div>

          <div class="form-group">
            <div class="form-label">
              <span>⏳ 事件发生时间（决定在人生链上的位置）</span>
              <span style="color:var(--amber-bright); font-family:var(--font-mono);">
                自动换算：当时 ${previewAge} 岁 · ${inferEraByAge(previewAge)}
              </span>
            </div>
            <div class="form-row-3">
              <input
                type="number"
                class="form-input"
                placeholder="年份 (如 2012)"
                value="${escapeHtml(f.eventYear)}"
                oninput="updateFormField('eventYear', this.value)"
              />
              <input
                type="number"
                min="1"
                max="12"
                class="form-input"
                placeholder="月份 (可选)"
                value="${escapeHtml(f.eventMonth)}"
                oninput="updateFormField('eventMonth', this.value)"
              />
              <input
                type="number"
                min="1"
                max="31"
                class="form-input"
                placeholder="日期 (可选)"
                value="${escapeHtml(f.eventDay)}"
                oninput="updateFormField('eventDay', this.value)"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">🕰️ 记忆时间锚点 / 模糊描述</label>
            <input
              type="text"
              class="form-input"
              placeholder="如：15岁 · 台风过境的晚自习"
              value="${escapeHtml(f.fuzzyTimeLabel)}"
              oninput="updateFormFieldSilent('fuzzyTimeLabel', this.value)"
            />
          </div>

          <!-- Location & Gaode Map Coordinates -->
          <div class="form-group" style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:12px; padding:0.85rem;">
            <div class="form-label">
              <span>📍 发生地点与高德地图坐标</span>
              <div style="display:flex; gap:0.4rem;">
                <button type="button" class="btn btn-sm" onclick="autoMatchCityCoords()">🧭 按城市名自动定位</button>
                <button type="button" class="btn btn-sm btn-ghost-amber" onclick="openMapPickerModal()">🗺️ 在高德地图上选点</button>
              </div>
            </div>
            <input
              type="text"
              id="studio-location-input"
              class="form-input"
              style="margin-bottom:0.6rem;"
              placeholder="如：湖南长沙 · 外公的小院（输入城市名可自动匹配坐标）"
              value="${escapeHtml(f.location)}"
              oninput="handleLocationTextChange(this.value)"
            />
            <div class="form-row">
              <div>
                <label class="form-label" style="font-size:0.72rem;">经度 (Lng · GCJ-02)</label>
                <input
                  type="number"
                  step="0.0001"
                  id="studio-lng-input"
                  class="form-input"
                  value="${escapeHtml(f.lng ?? 121.4737)}"
                  oninput="updateFormFieldSilent('lng', parseFloat(this.value))"
                />
              </div>
              <div>
                <label class="form-label" style="font-size:0.72rem;">纬度 (Lat · GCJ-02)</label>
                <input
                  type="number"
                  step="0.0001"
                  id="studio-lat-input"
                  class="form-input"
                  value="${escapeHtml(f.lat ?? 31.2304)}"
                  oninput="updateFormFieldSilent('lat', parseFloat(this.value))"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">📜 随笔标题</label>
            <input
              type="text"
              class="form-input"
              placeholder="给这段记忆起一个像电影分镜一样的标题..."
              value="${escapeHtml(f.title)}"
              oninput="updateFormFieldSilent('title', this.value)"
            />
          </div>

          <div class="form-group">
            <div class="form-label">
              <span>🖋️ 随笔正文（记录当时的画面、气味、心境或回响）</span>
            </div>
            <textarea
              id="studio-essay-textarea"
              class="form-textarea"
              placeholder="写下那段时光的故事。哪怕当时没有留下照片，AI 也能根据你的随笔文字为你显影配图..."
              oninput="updateFormFieldSilent('content', this.value)"
            >${escapeHtml(f.content)}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">🎭 当时心境</label>
              <select class="form-select" onchange="updateFormFieldSilent('mood', this.value)">
                ${MOOD_OPTIONS.map(
                  (m) => `<option value="${escapeHtml(m)}" ${f.mood === m ? 'selected' : ''}>${escapeHtml(m)}</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">📚 所属人生阶段</label>
              <select class="form-select" onchange="updateFormFieldSilent('eraTag', this.value)">
                ${['童年拾遗', '少年求索', '旷野远行', '当下回响']
                  .map((era) => `<option value="${era}" ${f.eraTag === era ? 'selected' : ''}>${era}</option>`)
                  .join('')}
              </select>
            </div>
          </div>

          <!-- Dual-Mode Visual Pairing -->
          <div class="form-group" style="margin-top:0.5rem;">
            <label class="form-label">🎞️ 记忆配图方式（支持 AI 读文生图 或 自己上传照片）</label>
            <div class="visual-mode-switch">
              <button
                type="button"
                class="visual-tab-btn ${f.imageSource === 'AI' ? 'active' : ''}"
                onclick="setVisualSource('AI')"
              >
                ✨ AI 记忆显影 (AI 配图)
              </button>
              <button
                type="button"
                class="visual-tab-btn ${f.imageSource === 'UPLOAD' ? 'active' : ''}"
                onclick="setVisualSource('UPLOAD')"
              >
                📷 自己配图 (上传照片)
              </button>
            </div>

            ${
              f.imageSource === 'AI'
                ? `
              <div style="background:rgba(6,7,11,0.65); border:1px solid var(--border-subtle); border-radius:12px; padding:0.95rem;">
                <div class="form-row" style="margin-bottom:0.75rem;">
                  <div>
                    <label class="form-label">🎨 胶片画风预设</label>
                    <select class="form-select" onchange="changeAiStyle(this.value)">
                      ${AI_STYLES.map(
                        (s) => `<option value="${s.id}" ${f.aiStyle === s.id ? 'selected' : ''}>${s.label}</option>`
                      ).join('')}
                    </select>
                  </div>
                  <div>
                    <label class="form-label">🌌 画面母题构图</label>
                    <select class="form-select" onchange="updateFormFieldSilent('sceneMotif', this.value)">
                      ${SCENE_MOTIFS.map(
                        (m) => `<option value="${m.id}" ${(f.sceneMotif || 'auto') === m.id ? 'selected' : ''}>${m.label}</option>`
                      ).join('')}
                    </select>
                  </div>
                </div>

                <div style="margin-bottom:0.75rem;">
                  <div class="form-label">
                    <span>🪄 画面意境描述 (Prompt)</span>
                    <button type="button" class="btn btn-sm btn-ghost-amber" onclick="extractPromptFromEssay()">
                      🪄 从随笔自动提炼意境
                    </button>
                  </div>
                  <input
                    type="text"
                    id="studio-ai-prompt"
                    class="form-input"
                    placeholder="点击右上方「从随笔自动提炼意境」或手动输入画面描述..."
                    value="${escapeHtml(f.aiPrompt)}"
                    oninput="updateFormFieldSilent('aiPrompt', this.value)"
                  />
                </div>

                <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
                  <button
                    type="button"
                    class="btn btn-amber"
                    style="flex:1; justify-content:center;"
                    onclick="triggerAiGenerate(false)"
                    ${state.isGeneratingAi ? 'disabled' : ''}
                  >
                    ${state.isGeneratingAi ? '🎞️ 正在暗房显影中...' : '🎬 立即 AI 显影生成配图'}
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm"
                    onclick="triggerAiGenerate(true)"
                    title="使用云端 Flux 引擎尝试生图"
                  >
                    🌐 云端大模型生图
                  </button>
                </div>
              </div>
            `
                : `
              <div class="upload-dropzone" onclick="document.getElementById('file-upload-input').click()">
                <div style="font-size:1.5rem; margin-bottom:0.35rem;">📷</div>
                <div style="font-size:0.88rem; color:var(--amber-pale); font-weight:500;">
                  点击选择本地照片上传（JPG / PNG / WebP）
                </div>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">
                  上传后将自动套用 35mm 电影胶片画框与暗角质感
                </div>
                <input
                  type="file"
                  id="file-upload-input"
                  accept="image/*"
                  style="display:none"
                  onchange="handleFileUpload(event)"
                />
              </div>
            `
            }

            <div style="margin-top:0.85rem;">
              <div class="form-label">
                <span>🎞️ 实时胶片画面预览</span>
                <select
                  class="form-select"
                  style="width:auto; padding:0.2rem 0.6rem; font-size:0.75rem;"
                  onchange="updateFormField('filmFilter', this.value)"
                >
                  <option value="warm" ${f.filmFilter === 'warm' ? 'selected' : ''}>滤镜：柯达暖金</option>
                  <option value="cool" ${f.filmFilter === 'cool' ? 'selected' : ''}>滤镜：暮色冷蓝</option>
                  <option value="neon" ${f.filmFilter === 'neon' ? 'selected' : ''}>滤镜：霓虹高饱和</option>
                  <option value="contrast" ${f.filmFilter === 'contrast' ? 'selected' : ''}>滤镜：暗调电影</option>
                  <option value="bw" ${f.filmFilter === 'bw' ? 'selected' : ''}>滤镜：银盐黑白</option>
                </select>
              </div>
              <div class="preview-frame-box">
                <img
                  id="studio-preview-img"
                  src="${escapeHtml(f.imageUrl)}"
                  alt="Preview"
                  class="${f.filmFilter ? 'filter-' + f.filmFilter : ''}"
                />
              </div>
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; margin:1.1rem 0 1.2rem; padding:0.65rem 0.85rem; background:rgba(255,255,255,0.03); border-radius:10px;">
            <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.84rem; cursor:pointer;">
              <input
                type="checkbox"
                ${f.isPublic !== false ? 'checked' : ''}
                onchange="updateFormFieldSilent('isPublic', this.checked)"
              />
              <span>🌐 在公开分享的「人生溯源链」中展示此节点</span>
            </label>
          </div>

          <button class="btn btn-amber" style="width:100%; justify-content:center; padding:0.75rem;" onclick="saveLifeNode()">
            💾 ${f.id ? '保存修改并更新人生链' : '定格此瞬间 · 加入我的人生溯源链'}
          </button>
        </div>

        <!-- RIGHT PANEL: Existing Life Chain Nodes Management -->
        <div class="studio-panel">
          <div class="panel-title">
            <span>🔗 我的人生素材链 (${state.nodes.length} 个节点)</span>
            <div style="display:flex; gap:0.4rem;">
              <button class="era-pill ${state.studioFilter === 'ALL' ? 'active' : ''}" onclick="setStudioFilter('ALL')">全部</button>
              <button class="era-pill ${state.studioFilter === 'PUBLIC' ? 'active' : ''}" onclick="setStudioFilter('PUBLIC')">公开 (${state.nodes.filter(n => n.isPublic !== false).length})</button>
              <button class="era-pill ${state.studioFilter === 'PRIVATE' ? 'active' : ''}" onclick="setStudioFilter('PRIVATE')">私密 (${state.nodes.filter(n => n.isPublic === false).length})</button>
            </div>
          </div>

          <div class="studio-node-list">
            ${sortedNodes
              .map((node, idx) => {
                const age = computeAge(node.eventYear);
                const coords = getNodeCoords(node, idx);
                return `
                  <div class="studio-node-item">
                    <div class="studio-node-thumb">
                      <img src="${escapeHtml(node.imageUrl)}" alt="${escapeHtml(node.title)}" class="${node.filmFilter ? 'filter-' + node.filmFilter : ''}" />
                    </div>
                    <div>
                      <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem; flex-wrap:wrap;">
                        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--amber-bright); font-weight:700;">
                          ${node.eventYear}年 (${age}岁)
                        </span>
                        <span style="font-size:0.72rem; color:var(--text-muted); padding:0.1rem 0.45rem; border:1px solid var(--border-subtle); border-radius:999px;">
                          📍 ${escapeHtml(node.location || `${coords.lng.toFixed(1)},${coords.lat.toFixed(1)}`)}
                        </span>
                        <span style="font-size:0.72rem; color:${node.imageSource === 'AI' ? '#fcd34d' : '#7dd3fc'};">
                          ${node.imageSource === 'AI' ? '✨ AI配图' : '📷 自配图'}
                        </span>
                        <span style="font-size:0.72rem; color:${node.isPublic !== false ? '#4ade80' : '#f87171'};">
                          ${node.isPublic !== false ? '● 已公开' : '🔒 私密'}
                        </span>
                      </div>
                      <h4 style="font-family:var(--font-serif); font-size:1.02rem; color:#fff; margin-bottom:0.3rem;">
                        ${escapeHtml(node.title)}
                      </h4>
                      <p style="font-size:0.82rem; color:var(--text-secondary); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.55;">
                        ${escapeHtml(node.content)}
                      </p>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:0.4rem;">
                      <button class="btn btn-sm" onclick="editNode('${escapeHtml(node.id)}')">✏️ 编辑</button>
                      <button class="btn btn-sm" onclick="toggleNodeVisibility('${escapeHtml(node.id)}')">
                        ${node.isPublic !== false ? '🔒 设为私密' : '🌐 设为公开'}
                      </button>
                      <button class="btn btn-sm btn-danger" onclick="deleteNode('${escapeHtml(node.id)}')">🗑️ 删除</button>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 3. MODALS: LIGHTBOX, MAP PICKER, SHARE CENTER, PROFILE, AI & AMAP CONFIG
// ============================================================================
function renderMapPickerModal() {
  const f = state.editingNode;
  return `
    <div class="modal-backdrop" onclick="if(event.target===this) closeMapPickerModal()">
      <div class="modal-card" style="max-width:780px;">
        <div class="panel-title">
          <span>🗺️ 高德地图坐标拾取器（点击地图任意位置选定发生坐标）</span>
          <button class="btn btn-sm" onclick="closeMapPickerModal()">✕</button>
        </div>

        <div id="amap-picker-canvas" style="width:100%; height:420px; border-radius:12px; border:1px solid var(--border-amber); overflow:hidden; margin-bottom:1rem;"></div>

        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem;">
          <div style="font-family:var(--font-mono); font-size:0.84rem; color:var(--amber-pale);">
            当前选定坐标 (GCJ-02)：<span id="picker-coord-readout">${Number(f.lng || 121.4737).toFixed(4)}°E, ${Number(f.lat || 31.2304).toFixed(4)}°N</span>
          </div>
          <button class="btn btn-amber" onclick="closeMapPickerModal()">✅ 确认使用此坐标</button>
        </div>
      </div>
    </div>
  `;
}

function initStudioPickerMap() {
  const container = document.getElementById('amap-picker-canvas');
  if (!container || typeof L === 'undefined') return;
  if (pickerMapInstance) {
    pickerMapInstance.remove();
    pickerMapInstance = null;
  }

  const f = state.editingNode;
  const initLng = Number(f.lng) || 116.4074;
  const initLat = Number(f.lat) || 39.9042;

  const map = L.map(container, {
    center: [initLat, initLng],
    zoom: 6,
    attributionControl: false
  });
  pickerMapInstance = map;

  L.tileLayer(
    'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    { subdomains: ['1', '2', '3', '4'], maxZoom: 18, className: 'amap-tile-dark' }
  ).addTo(map);

  pickerMarker = L.marker([initLat, initLng]).addTo(map);

  map.on('click', (e) => {
    const lat = Number(e.latlng.lat.toFixed(4));
    const lng = Number(e.latlng.lng.toFixed(4));
    state.editingNode.lat = lat;
    state.editingNode.lng = lng;
    if (pickerMarker) pickerMarker.setLatLng([lat, lng]);
    const readout = document.getElementById('picker-coord-readout');
    if (readout) readout.textContent = `${lng}°E, ${lat}°N`;
  });
}

function renderLightboxModal() {
  const sorted = getSortedNodes(
    state.routeMode === 'share' ? state.nodes.filter((n) => n.isPublic !== false) : state.nodes,
    state.sortOrder
  );
  const idx = sorted.findIndex((n) => n.id === state.lightboxNodeId);
  if (idx === -1) return '';
  const node = sorted[idx];
  const age = computeAge(node.eventYear);
  const prevNode = idx > 0 ? sorted[idx - 1] : null;
  const nextNode = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  return `
    <div class="modal-backdrop" onclick="if(event.target===this) closeLightbox()">
      <div class="modal-card lightbox-modal">
        <div class="film-strip-bar" style="padding:0.65rem 1.25rem;">
          <span>🎞️ ${escapeHtml(node.frameCode || '35MM ARCHIVE PROJECTION')} · ${node.eventYear}年 (${age}岁)</span>
          <button class="btn btn-sm" onclick="closeLightbox()">✕ 关闭放映</button>
        </div>

        <div class="film-media-wrap" style="max-height:460px;">
          <img src="${escapeHtml(node.imageUrl)}" alt="${escapeHtml(node.title)}" class="${node.filmFilter ? 'filter-' + node.filmFilter : ''}" />
        </div>

        <div style="padding:1.75rem 2rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.6rem;">
            <span style="font-family:var(--font-mono); font-size:0.84rem; color:var(--amber-bright);">
              ⏳ ${escapeHtml(node.fuzzyTimeLabel || `${node.eventYear}年 · ${age}岁`)}
              ${node.location ? ` · 📍 ${escapeHtml(node.location)}` : ''}
            </span>
            <span style="font-size:0.8rem; color:var(--text-secondary);">
              ${escapeHtml(node.mood || '')} · ${node.imageSource === 'AI' ? `✨ AI 显影 (${escapeHtml(node.aiStyleLabel || '35mm')})` : '📷 实拍照片'}
            </span>
          </div>

          <h2 style="font-family:var(--font-serif); font-size:1.6rem; color:#fff; margin-bottom:1.1rem;">
            ${escapeHtml(node.title)}
          </h2>

          <div style="font-family:var(--font-serif); font-size:1.02rem; line-height:1.95; color:#e2e8f0; white-space:pre-line; margin-bottom:1.5rem;">
            ${escapeHtml(node.content)}
          </div>

          ${
            node.imageSource === 'AI' && node.aiPrompt
              ? `
            <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:10px; padding:0.65rem 0.95rem; font-family:var(--font-mono); font-size:0.74rem; color:var(--text-muted); margin-bottom:1.25rem;">
              🎨 AI 记忆显影 Prompt: ${escapeHtml(node.aiPrompt)}
            </div>
          `
              : ''
          }

          <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border-subtle); padding-top:1rem;">
            <div>
              ${
                prevNode
                  ? `<button class="btn btn-sm" onclick="openLightbox('${escapeHtml(prevNode.id)}')">◀ 上一帧：${escapeHtml(prevNode.title.slice(0, 10))}...</button>`
                  : `<span style="font-size:0.78rem; color:var(--text-muted);">已是第一帧</span>`
              }
            </div>
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">
              FRAME ${idx + 1} / ${sorted.length}
            </span>
            <div>
              ${
                nextNode
                  ? `<button class="btn btn-sm" onclick="openLightbox('${escapeHtml(nextNode.id)}')">下一帧：${escapeHtml(nextNode.title.slice(0, 10))}... ▶</button>`
                  : `<span style="font-size:0.78rem; color:var(--text-muted);">已是最后一帧</span>`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderShareModal() {
  const sc = state.shareConfig;
  const fullShareUrl = `${window.location.origin}/share/${encodeURIComponent(sc.slug || 'linshen-1998')}`;
  const publicCount = state.nodes.filter((n) => n.isPublic !== false).length;

  return `
    <div class="modal-backdrop" onclick="if(event.target===this) closeShareModal()">
      <div class="modal-card">
        <div class="panel-title">
          <span>🔗 分享我的人生溯源链</span>
          <button class="btn btn-sm" onclick="closeShareModal()">✕</button>
        </div>

        <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1.1rem; line-height:1.6;">
          生成专属分享链接后，好友点进链接即可通过 <strong>「流光时间链」</strong> 或 <strong>「高德足迹地图模式」</strong> 浏览你按时间串联的 <strong>${publicCount} 个公开人生切片</strong>。
        </p>

        <div class="form-group">
          <label class="form-label">🏷️ 专属分享链接后缀 (Slug)</label>
          <input
            type="text"
            id="share-slug-input"
            class="form-input"
            value="${escapeHtml(sc.slug)}"
            placeholder="如：linshen-1998"
          />
        </div>

        <div class="form-group">
          <label class="form-label">🎬 分享馆标题</label>
          <input
            type="text"
            id="share-title-input"
            class="form-input"
            value="${escapeHtml(sc.title || state.profile.exhibitionTitle)}"
          />
        </div>

        <div class="form-group">
          <label class="form-label">💌 给访客的序言寄语</label>
          <textarea
            id="share-welcome-input"
            class="form-textarea"
            style="min-height:80px;"
          >${escapeHtml(sc.welcomeNote || state.profile.prologue)}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">🔐 访问暗号保护（留空则所有人可直接点开浏览）</label>
          <input
            type="text"
            id="share-passcode-input"
            class="form-input"
            placeholder="留空代表免密公开；填写则访客需输入暗号"
            value="${escapeHtml(sc.passcode || '')}"
          />
        </div>

        <div style="margin: 1.1rem 0;">
          <div class="form-label">✨ 你的专属溯源链分享地址：</div>
          <div class="share-url-box">
            <span id="generated-share-url">${escapeHtml(fullShareUrl)}</span>
            <button class="btn btn-sm btn-amber" onclick="saveAndCopyShareLink()">📋 保存并复制链接</button>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.65rem; margin-top:1.25rem;">
          <a href="${escapeHtml(fullShareUrl)}" target="_blank" class="btn btn-ghost-amber">
            👀 以访客视角打开分享页
          </a>
          <button class="btn btn-amber" onclick="saveAndCopyShareLink()">
            💾 保存分享设置并复制链接
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProfileModal() {
  const p = state.profile;
  return `
    <div class="modal-backdrop" onclick="if(event.target===this) closeProfileModal()">
      <div class="modal-card">
        <div class="panel-title">
          <span>👤 人生档案与展馆导语设置</span>
          <button class="btn btn-sm" onclick="closeProfileModal()">✕</button>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">署名 / 作者昵称</label>
            <input type="text" id="prof-name" class="form-input" value="${escapeHtml(p.name)}" />
          </div>
          <div class="form-group">
            <label class="form-label">出生年份（用于自动计算各节点年龄）</label>
            <input type="number" id="prof-birth" class="form-input" value="${escapeHtml(p.birthYear)}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">展馆主标题</label>
          <input type="text" id="prof-title" class="form-input" value="${escapeHtml(p.exhibitionTitle)}" />
        </div>

        <div class="form-group">
          <label class="form-label">展馆副标题</label>
          <input type="text" id="prof-sub" class="form-input" value="${escapeHtml(p.subtitle)}" />
        </div>

        <div class="form-group">
          <label class="form-label">人生序言 / 卷首语</label>
          <textarea id="prof-prologue" class="form-textarea" style="min-height:95px;">${escapeHtml(p.prologue)}</textarea>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.65rem; margin-top:1.25rem;">
          <button class="btn" onclick="closeProfileModal()">取消</button>
          <button class="btn btn-amber" onclick="saveProfileSettings()">💾 保存档案设置</button>
        </div>
      </div>
    </div>
  `;
}

function renderAiConfigModal() {
  const ai = state.aiConfig;
  return `
    <div class="modal-backdrop" onclick="if(event.target===this) closeAiConfigModal()">
      <div class="modal-card">
        <div class="panel-title">
          <span>⚙️ AI 记忆显影与高德地图设置</span>
          <button class="btn btn-sm" onclick="closeAiConfigModal()">✕</button>
        </div>

        <div class="form-group">
          <label class="form-label">🎨 AI 生图通道选择</label>
          <select id="ai-provider-select" class="form-select">
            <option value="builtin_free" ${ai.provider === 'builtin_free' ? 'selected' : ''}>✨ 内置免费 AI 胶片显影通道（默认 · 免配置开箱即用）</option>
            <option value="siliconflow" ${ai.provider === 'siliconflow' ? 'selected' : ''}>🚀 硅基流动 SiliconFlow (Kolors / Flux.1)</option>
            <option value="zhipu" ${ai.provider === 'zhipu' ? 'selected' : ''}>🎨 智谱清言 BigModel (CogView-3)</option>
            <option value="openai" ${ai.provider === 'openai' ? 'selected' : ''}>🌐 OpenAI 兼容生图接口 (DALL·E 3)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">自定义生图 API Key（使用内置免费通道时可留空）</label>
          <input
            type="password"
            id="ai-apikey-input"
            class="form-input"
            placeholder="sk-..."
            value="${escapeHtml(ai.apiKey || '')}"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">API Base URL</label>
            <input
              type="text"
              id="ai-baseurl-input"
              class="form-input"
              value="${escapeHtml(ai.baseUrl || 'https://api.siliconflow.cn/v1/images/generations')}"
            />
          </div>
          <div class="form-group">
            <label class="form-label">模型名称 (Model)</label>
            <input
              type="text"
              id="ai-model-input"
              class="form-input"
              value="${escapeHtml(ai.model || 'Kwai-Kolors/Kolors')}"
            />
          </div>
        </div>

        <hr style="border:none; border-top:1px solid var(--border-subtle); margin:1rem 0;" />

        <div class="form-group">
          <label class="form-label">🗺️ 高德地图 Web端 Key（选填，内置高德瓦片引擎已默认免Key直连）</label>
          <input
            type="text"
            id="amap-key-input"
            class="form-input"
            placeholder="默认已启用高德地图免Key瓦片引擎；如有个人高德Key可填入"
            value="${escapeHtml(ai.amapKey || '')}"
          />
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.65rem; margin-top:1.25rem;">
          <button class="btn" onclick="closeAiConfigModal()">取消</button>
          <button class="btn btn-amber" onclick="saveAiConfigSettings()">💾 保存配置</button>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// INTERACTION HANDLERS
// ============================================================================
window.setEraFilter = function (era) {
  stopMapTour();
  state.selectedEra = era;
  render();
};

window.updateSearchQuery = function (val) {
  stopMapTour();
  state.searchQuery = val;
  render();
  const input = document.querySelector('.search-input');
  if (input) {
    input.focus();
    input.setSelectionRange(val.length, val.length);
  }
};

window.toggleTimelineSortOrder = function () {
  stopMapTour();
  state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
  showToast(state.sortOrder === 'asc' ? '⏳ 已切换为：从童年向当下正序溯源' : '🕰️ 已切换为：从当下向童年倒序回溯');
  render();
};

window.setViewLayout = function (layout) {
  stopMapTour();
  state.viewLayout = layout;
  render();
};

window.openLightbox = function (nodeId) {
  state.lightboxNodeId = nodeId;
  render();
};

window.closeLightbox = function () {
  state.lightboxNodeId = null;
  render();
};

window.openShareModal = function () {
  state.showShareModal = true;
  render();
};

window.closeShareModal = function () {
  state.showShareModal = false;
  render();
};

window.openProfileModal = function () {
  state.showProfileModal = true;
  render();
};

window.closeProfileModal = function () {
  state.showProfileModal = false;
  render();
};

window.openAiConfigModal = function () {
  state.showAiConfigModal = true;
  render();
};

window.closeAiConfigModal = function () {
  state.showAiConfigModal = false;
  render();
};

window.openMapPickerModal = function () {
  state.showMapPickerModal = true;
  render();
};

window.closeMapPickerModal = function () {
  state.showMapPickerModal = false;
  render();
};

window.setStudioFilter = function (filter) {
  state.studioFilter = filter;
  render();
};

window.updateFormField = function (field, value) {
  state.editingNode[field] = value;
  if (field === 'eventYear') {
    const age = computeAge(value);
    state.editingNode.eraTag = inferEraByAge(age);
  }
  render();
};

window.updateFormFieldSilent = function (field, value) {
  state.editingNode[field] = value;
};

window.handleLocationTextChange = function (val) {
  state.editingNode.location = val;
  const matched = inferCoordsFromLocation(val);
  if (matched.matchedCity) {
    state.editingNode.lng = matched.lng;
    state.editingNode.lat = matched.lat;
    const lngEl = document.getElementById('studio-lng-input');
    const latEl = document.getElementById('studio-lat-input');
    if (lngEl) lngEl.value = matched.lng;
    if (latEl) latEl.value = matched.lat;
  }
};

window.autoMatchCityCoords = function () {
  const loc = state.editingNode.location || '';
  const matched = inferCoordsFromLocation(loc);
  state.editingNode.lng = matched.lng;
  state.editingNode.lat = matched.lat;
  if (matched.matchedCity) {
    showToast(`🧭 已自动定位至「${matched.matchedCity}」高德坐标 (${matched.lng}, ${matched.lat})`);
  } else {
    showToast('💡 未识别到具体城市名，可点击右侧「在高德地图上选点」精确拾取');
  }
  render();
};

window.setVisualSource = function (source) {
  state.editingNode.imageSource = source;
  render();
};

window.changeAiStyle = function (styleId) {
  const found = AI_STYLES.find((s) => s.id === styleId) || AI_STYLES[0];
  state.editingNode.aiStyle = found.id;
  state.editingNode.aiStyleLabel = found.label;
  state.editingNode.filmFilter = found.filter;
  state.editingNode.frameCode = `${found.code} · FRAME`;
  render();
};

window.insertRandomPrompt = function () {
  const randomQ = WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)];
  if (!state.editingNode.content) {
    state.editingNode.content = randomQ + '\n\n';
  } else {
    state.editingNode.content += '\n\n' + randomQ;
  }
  showToast('💡 已填入一条回忆灵感线索');
  render();
};

window.extractPromptFromEssay = function () {
  const f = state.editingNode;
  const styleObj = AI_STYLES.find((s) => s.id === f.aiStyle) || AI_STYLES[0];
  const age = computeAge(f.eventYear);
  const titlePart = f.title ? f.title : '人生记忆瞬间';
  const locPart = f.location ? `at ${f.location}` : '';
  const excerpt = (f.content || '').replace(/\s+/g, ' ').slice(0, 48);

  const generatedPrompt = `Year ${f.eventYear} (${age} years old), "${titlePart}" ${locPart}, ${excerpt ? `scene mood: ${excerpt}, ` : ''}${styleObj.promptSuffix}`;
  f.aiPrompt = generatedPrompt;
  const input = document.getElementById('studio-ai-prompt');
  if (input) input.value = generatedPrompt;
  showToast('🪄 已从你的随笔文字中提炼 35mm 电影画面描述');
};

window.triggerAiGenerate = async function (tryCloud = false) {
  const f = state.editingNode;
  if (!f.aiPrompt) {
    window.extractPromptFromEssay();
  }
  state.isGeneratingAi = true;
  render();

  try {
    const res = await fetch('/api/ai-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: f.aiPrompt,
        style: f.aiStyle || 'kodak_warm',
        title: f.title || f.fuzzyTimeLabel || '时光显影',
        year: f.eventYear || '2026',
        scene: f.sceneMotif || 'auto'
      })
    });
    const data = await res.json();
    if (data.ok) {
      f.imageUrl = tryCloud && data.externalAiUrl ? data.externalAiUrl : data.imageUrl;
      f.imageSource = 'AI';
      showToast('✨ AI 记忆显影完成！已生成 35mm 电影感配图');
    } else {
      showToast('⚠️ 生图异常：' + (data.error || '未知错误'));
    }
  } catch (err) {
    showToast('⚠️ AI 显影请求失败');
  } finally {
    state.isGeneratingAi = false;
    render();
  }
};

window.handleFileUpload = function (event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    const img = new Image();
    img.onload = async function () {
      const canvas = document.createElement('canvas');
      const maxW = 1280;
      let w = img.width;
      let h = img.height;
      if (w > maxW) {
        h = Math.round((h * maxW) / w);
        w = maxW;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.86);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: compressedDataUrl, filename: file.name })
        });
        const data = await res.json();
        if (data.ok) {
          state.editingNode.imageUrl = data.imageUrl;
          state.editingNode.imageSource = 'UPLOAD';
          showToast('📷 照片已上传并装入 35mm 胶片画框');
          render();
        }
      } catch (e) {
        showToast('⚠️ 图片上传失败');
      }
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
};

window.saveLifeNode = async function () {
  const f = state.editingNode;
  if (!f.title || !f.title.trim()) {
    showToast('✍️ 请先填写随笔标题');
    return;
  }
  if (!f.content || !f.content.trim()) {
    showToast('✍️ 请写下一点随笔内容');
    return;
  }
  if (!f.eventYear) {
    showToast('⏳ 请填写事件发生的年份');
    return;
  }

  const age = computeAge(f.eventYear);
  if (!f.fuzzyTimeLabel || !f.fuzzyTimeLabel.trim()) {
    f.fuzzyTimeLabel = `${age}岁 · ${f.eventYear}年`;
  }

  try {
    const res = await fetch('/api/nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f)
    });
    const data = await res.json();
    if (data.ok) {
      state.nodes = data.nodes;
      showToast(f.id ? '✅ 人生节点已更新！' : '🎉 新的人生节点已串联进你的人生溯源链！');
      state.editingNode = getEmptyNodeForm();
      render();
    }
  } catch (err) {
    showToast('⚠️ 保存失败，请重试');
  }
};

window.resetEditorForm = function () {
  state.editingNode = getEmptyNodeForm();
  render();
};

window.editNode = function (nodeId) {
  const found = state.nodes.find((n) => n.id === nodeId);
  if (!found) return;
  state.editingNode = JSON.parse(JSON.stringify(found));
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(`✏️ 正在编辑：${found.title}`);
};

window.toggleNodeVisibility = async function (nodeId) {
  const found = state.nodes.find((n) => n.id === nodeId);
  if (!found) return;
  found.isPublic = found.isPublic === false ? true : false;
  const res = await fetch('/api/nodes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(found)
  });
  const data = await res.json();
  if (data.ok) {
    state.nodes = data.nodes;
    showToast(found.isPublic ? '🌐 已设为公开展示' : '🔒 已设为私密珍藏');
    render();
  }
};

window.deleteNode = async function (nodeId) {
  const found = state.nodes.find((n) => n.id === nodeId);
  if (!found) return;
  if (!confirm(`确定要从人生记录本中删除「${found.title}」吗？`)) return;

  const res = await fetch(`/api/nodes/${encodeURIComponent(nodeId)}`, { method: 'DELETE' });
  const data = await res.json();
  if (data.ok) {
    state.nodes = data.nodes;
    if (state.editingNode.id === nodeId) {
      state.editingNode = getEmptyNodeForm();
    }
    showToast('🗑️ 节点已删除');
    render();
  }
};

window.saveAndCopyShareLink = async function () {
  const slug = document.getElementById('share-slug-input')?.value.trim() || 'my-life-chain';
  const title = document.getElementById('share-title-input')?.value.trim() || state.profile.exhibitionTitle;
  const welcomeNote = document.getElementById('share-welcome-input')?.value.trim() || '';
  const passcode = document.getElementById('share-passcode-input')?.value.trim() || '';

  const res = await fetch('/api/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, title, welcomeNote, passcode })
  });
  const data = await res.json();
  if (data.ok) {
    state.shareConfig = data.shareConfig;
    const shareUrl = `${window.location.origin}/share/${encodeURIComponent(state.shareConfig.slug)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('🎉 专属溯源链分享链接已生成并复制到剪贴板！');
    } catch (_) {
      showToast('🎉 专属溯源链分享设置已保存！');
    }
    render();
  }
};

window.copyCurrentShareUrl = async function () {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast('📋 溯源链链接已复制到剪贴板！');
  } catch (_) {
    showToast('📋 请直接复制浏览器地址栏链接分享');
  }
};

window.saveProfileSettings = async function () {
  const name = document.getElementById('prof-name')?.value.trim() || '林深';
  const birthYear = Number(document.getElementById('prof-birth')?.value) || 1998;
  const exhibitionTitle = document.getElementById('prof-title')?.value.trim() || '人生记录本 · 深夜胶片馆';
  const subtitle = document.getElementById('prof-sub')?.value.trim() || '';
  const prologue = document.getElementById('prof-prologue')?.value.trim() || '';

  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, birthYear, exhibitionTitle, subtitle, prologue })
  });
  const data = await res.json();
  if (data.ok) {
    state.profile = data.profile;
    state.showProfileModal = false;
    showToast('✅ 人生档案设置已保存');
    render();
  }
};

window.saveAiConfigSettings = async function () {
  const provider = document.getElementById('ai-provider-select')?.value || 'builtin_free';
  const apiKey = document.getElementById('ai-apikey-input')?.value.trim() || '';
  const baseUrl = document.getElementById('ai-baseurl-input')?.value.trim() || '';
  const model = document.getElementById('ai-model-input')?.value.trim() || '';
  const amapKey = document.getElementById('amap-key-input')?.value.trim() || '';

  const res = await fetch('/api/ai-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, apiKey, baseUrl, model, amapKey })
  });
  const data = await res.json();
  if (data.ok) {
    state.aiConfig = data.aiConfig;
    state.showAiConfigModal = false;
    showToast('✅ AI 与高德地图设置已更新');
    render();
  }
};

document.addEventListener('DOMContentLoaded', initApp);
