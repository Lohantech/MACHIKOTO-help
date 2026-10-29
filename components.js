// ==========================================================================
// CENTRALIZED COMPONENTS & SEARCH ENGINE (HEADER, NAV, FOOTER)
// ==========================================================================

// Single list of articles: title + search keywords.
const ARTICLES = [
  {
    id: 'browser',
    title: 'ブラウザの設定方法（ホームページと新しいタブ）',
    keywords: ['ブラウザ', 'browser', 'タブ', '新しいタブ', 'ホームページ', 'ホーム', '設定', '起動',
               'firefox', 'chrome', 'edge', 'safari', 'ファイアフォックス', 'クローム', 'エッジ', 'サファリ']
  },
  {
    id: 'SPC',
    title: 'プライバシーポリシーおよび利用規約',
    keywords: ['プライバシー', 'ポリシー', '規約', '利用規約', 'spc', 'cookie', 'クッキー', '不具合',
               '個人情報', 'ローカルストレージ', 'キャッシュ', 'privacy']
  },
  {
    id: 'Credit',
    title: 'クレジット表示と貢献者',
    keywords: ['クレジット', 'credit', '貢献者', '素材', '作者', '早乙女', 'ロアン', '写真',
               'アイコン', 'flaticon', 'freepik', 'github']
  }
];

// Path to the article page, depending on current location.
let ROOT_PATH = '';

function articleUrl(id) {
  return `${ROOT_PATH}section/article.html?doc=${encodeURIComponent(id)}`;
}

function loadHeader(rootPath = "") {
  ROOT_PATH = rootPath;

  const headerHTML = `
  <div id="topbar">
    <a href="https://wahoo.japan-vi.be/index">MACHIKOTO</a>
    <a href="https://hiroba.japan-vi.be/index">ひろば</a>
  </div>

  <header id="header">
    <div id="header-inner">
      <a href="https://wahoo.japan-vi.be/index" id="logo-area">
        <img id="logo-img" src="${rootPath}aero_touch/logo.svg" alt="MACHIKOTO" />
        <div style="display:none;" id="logo-fallback"><span>MACHIKOTO</span></div>
      </a>

      <div id="welcome-search">
        <div id="welcome">
          <div class="welcome-title">ようこそ MACHIKOTO | ヘルプ</div>
          <p>お探しのサポート情報を検索するか、下のカテゴリからお選びください。</p>
        </div>
        <form id="search-box" role="search">
          <div class="search-input-wrapper">
            <input type="text" placeholder="記事・キーワードを検索…" id="searchInput" autocomplete="off" aria-label="検索" />
          </div>
          <button type="submit" class="win7-button">検索</button>
        </form>
      </div>
    </div>
  </header>

  <nav id="nav-strip">
    <ul>
      <li><a href="${rootPath}index.html" class="win7-nav-btn">🏠 ホーム</a></li>
      <li><a href="${articleUrl('browser')}" class="win7-nav-btn">初めてご利用の方はこちらをクリック</a></li>
      <li><a href="${articleUrl('SPC')}" class="win7-nav-btn">サイトの不具合</a></li>
    </ul>
  </nav>
  `;

  const headerContainer = document.getElementById('global-header');
  if (!headerContainer) return;
  headerContainer.innerHTML = headerHTML;

  // Logo fallback handler: displays text if image is missing
  const logo = document.getElementById('logo-img');
  if (logo) {
    logo.addEventListener('error', function () {
      logo.style.display = 'none';
      const fallback = document.getElementById('logo-fallback');
      if (fallback) fallback.style.display = 'block';
    });
  }

  // Handle both button click and Enter key submit
  const searchBox = document.getElementById('search-box');
  if (searchBox) {
    searchBox.addEventListener('submit', function (e) {
      e.preventDefault();
      doSearch();
    });
  }
}

function loadFooter(rootPath = "") {
  const footerHTML = `
  <footer id="footer">
    <div id="footer-links">
      <a href="${articleUrl('SPC')}">利用規約</a>
      <a href="${articleUrl('SPC')}">プライバシーポリシー</a>
      <a href="${articleUrl('SPC')}">Cookie設定</a>
      <a href="${articleUrl('Credit')}">クレジット</a>
      <a href="mailto:support@japan-vi.be">お問い合わせ</a>
    </div>
    <div id="footer-copy">
      <strong>2025 - 2026 © MACHIKOTO</strong> — あなたのプライバシーを尊重します。いつでもデフォルトに戻せます。
    </div>
  </footer>
  `;

  const footerContainer = document.getElementById('global-footer');
  if (footerContainer) footerContainer.innerHTML = footerHTML;
}

// Normalizes query string: lowercase, full-width to half-width, unified hiragana/katakana
function normalize(str) {
  return str
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ぁ-ゖ]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60))
    .trim();
}

// Tolerant search engine execution
function doSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  const q = normalize(searchInput.value);
  if (!q) return;

  let best = null;
  let bestScore = 0;

  ARTICLES.forEach(article => {
    let score = 0;
    if (normalize(article.title).includes(q)) score += 3;
    article.keywords.forEach(kw => {
      const k = normalize(kw);
      if (k === q) score += 5;                            // Exact match
      else if (k.includes(q)) score += 2;                 // Partial match
      else if (q.length >= 2 && q.includes(k)) score += 1; // Phrase match
    });
    if (score > bestScore) { bestScore = score; best = article; }
  });

  if (best) {
    window.location.href = articleUrl(best.id);
  } else {
    alert('「' + searchInput.value.trim() + '」に一致する記事が見つかりませんでした。');
  }
}