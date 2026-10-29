// ==========================================================================
// COMPOSANTS CENTRALISÉS & MOTEUR DE RECHERCHE (HEADER, NAV, FOOTER)
// ==========================================================================

// Liste unique des articles : titre + mots-clés de recherche.
// (Pour ajouter un article : ajouter une entrée ici + un fichier articles/<id>.md
//  + une entrée dans metadataMap de section/article.html)
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

// Chemin vers la page article, selon l'endroit où l'on se trouve.
let ROOT_PATH = '';

function articleUrl(id) {
  return `${ROOT_PATH}section/article.html?doc=${encodeURIComponent(id)}`;
}

function loadHeader(rootPath = "") {
  ROOT_PATH = rootPath;

  const headerHTML = `
  <div id="topbar">
    <a href="https://wahoo.japan-vi.be/index">MACHIKOTO</a>
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
          <p>お探しのサポート情報を検索するか、<br>下のカテゴリからお選びください。</p>
        </div>
        <form id="search-box" role="search">
          <input type="text" placeholder="記事・キーワードを検索…" id="searchInput" autocomplete="off" aria-label="検索" />
          <button type="submit">検索</button>
        </form>
      </div>
    </div>
  </header>

  <nav id="nav-strip">
    <ul>
      <li><a href="${rootPath}index.html">🏠 ホーム</a></li>
      <li><a href="${articleUrl('browser')}">初めてご利用の方はこちらをクリック</a></li>
      <li><a href="${articleUrl('SPC')}">サイトの不具合</a></li>
    </ul>
  </nav>
  `;

  const headerContainer = document.getElementById('global-header');
  if (!headerContainer) return;
  headerContainer.innerHTML = headerHTML;

  // Logo : si l'image est absente, on affiche le texte de secours
  const logo = document.getElementById('logo-img');
  logo.addEventListener('error', function () {
    logo.style.display = 'none';
    document.getElementById('logo-fallback').style.display = 'block';
  });

  // Le formulaire gère à la fois le bouton et la touche Entrée
  document.getElementById('search-box').addEventListener('submit', function (e) {
    e.preventDefault();
    doSearch();
  });
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

// Normalise : minuscules, pleine largeur -> demi-largeur (ＡＢＣ -> abc), katakana/hiragana unifiés
function normalize(str) {
  return str
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ぁ-ゖ]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60))
    .trim();
}

// Moteur de recherche tolérant (recherche partielle dans le titre et les mots-clés)
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
      if (k === q) score += 5;                    // correspondance exacte
      else if (k.includes(q)) score += 2;         // saisie partielle (ex. "ブラ")
      else if (q.length >= 2 && q.includes(k)) score += 1; // phrase contenant le mot-clé
    });
    if (score > bestScore) { bestScore = score; best = article; }
  });

  if (best) {
    window.location.href = articleUrl(best.id);
  } else {
    alert('「' + searchInput.value.trim() + '」に一致する記事が見つかりませんでした。');
  }
}
