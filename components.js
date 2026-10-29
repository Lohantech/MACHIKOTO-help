// ==========================================================================
// CENTRALIZED COMPONENTS & SEARCH ENGINE (HEADER, NAV, FOOTER)
// ==========================================================================

function loadHeader(rootPath = "") {
  const headerHTML = `
  <div id="topbar">
    <a href="https://wahoo.japan-vi.be/index">MACHIKOTO</a>
  </div>

  <header id="header">
    <div id="header-inner">
      <a href="https://wahoo.japan-vi.be/index" id="logo-area">
        <img src="${rootPath}aero_touch/logo.svg" alt="MACHIKOTO" onerror="this.style.display='none';document.getElementById('logo-fallback').style.display='block';" />
        <div style="display:none;" id="logo-fallback"><span>MACHIKOTO</span></div>
      </a>

      <div id="welcome-search">
        <div id="welcome">
          <h1>ようこそ MACHIKOTO | ヘルプ</h1>
          <p>お探しのサポート情報を検索するか、<br>下のカテゴリからお選びください。</p>
        </div>
        <div id="search-box">
          <input type="text" placeholder="記事・キーワードを検索…" id="searchInput" />
          <button onclick="doSearch()">検索</button>
        </div>
      </div>
    </div>
  </header>

  <nav id="nav-strip">
    <ul>
      <li><a href="${rootPath}index.html">🏠 ホーム</a></li>
      <li><a href="${rootPath}section/article.html?doc=broswer">初めてご利用の方はこちらをクリック</a></li>
      <li><a href="${rootPath}section/article.html?doc=SPC">サイトの不具合</a></li>
    </ul>
  </nav>
  `;

  const headerContainer = document.getElementById('global-header');
  if (headerContainer) {
    headerContainer.innerHTML = headerHTML;
    
    // Support de la touche Entrée pour la recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          doSearch();
        }
      });
    }
  }
}

function loadFooter(rootPath = "") {
  const footerHTML = `
  <footer id="footer">
    <div id="footer-links">
      <a href="${rootPath}section/article.html?doc=SPC">利用規約</a>
      <a href="${rootPath}section/article.html?doc=SPC">プライバシーポリシー</a>
      <a href="${rootPath}section/article.html?doc=SPC">Cookie設定</a>
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

// Moteur de recherche tolérant (recherche partielle)
function doSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return;

  // Adaptateur de chemin (racine vs dossier section)
  const isInSection = window.location.pathname.includes('/section/');
  const prefix = isInSection ? './' : './section/';

  // Mots-clés élargis et caractères individuels
  const browserKeywords = ['ブ', 'ブラ', 'ブラウザ', 'browser', 'タブ', 'ホーム', '設定', 'firefox', 'chrome', 'edge', 'safari'];
  const spcKeywords = ['プ', 'プラ', 'プライバシー', '規約', '規', 'spc', 'cookie', 'クッキー', '不具合', '個人情報', 'ポリシー', '利用規約'];
  const creditKeywords = ['ク', 'クレ', 'クレジット', 'credit', '貢献者', '素材', '作者', '早乙女', 'ロアン', '写真'];

  // Verification
  const isBrowser = browserKeywords.some(kw => kw.includes(q) || q.includes(kw));
  const isSpc = spcKeywords.some(kw => kw.includes(q) || q.includes(kw));
  const isCredit = creditKeywords.some(kw => kw.includes(q) || q.includes(kw));

  if (isBrowser) {
    window.location.href = prefix + 'article.html?doc=broswer';
  } else if (isSpc) {
    window.location.href = prefix + 'article.html?doc=SPC';
  } else if (isCredit) {
    window.location.href = prefix + 'article.html?doc=Credit';
  } else {
    alert('「' + searchInput.value + '」に一致する記事が見つかりませんでした。');
  }
}