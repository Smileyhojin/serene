function enableThemeToggle() {
  const themeToggle = document.querySelector('#theme-toggle');
  if (!themeToggle) return;
  const hlLink = document.querySelector('link#hl');
  const preferDark = window.matchMedia("(prefers-color-scheme: dark)");
  function toggleTheme(theme) {
    if (theme == "dark") document.body.classList.add('dark'); else document.body.classList.remove('dark');
    if (hlLink) hlLink.href = `/giallo-${theme}.css`;
    sessionStorage.setItem("theme", theme);
  }
  themeToggle.addEventListener('click', () => toggleTheme(sessionStorage.getItem("theme") == "dark" ? "light" : "dark"));
  preferDark.addEventListener("change", e => toggleTheme(e.matches ? "dark" : "light"));
  if (!sessionStorage.getItem("theme") && preferDark.matches) toggleTheme("dark");
  if (sessionStorage.getItem("theme") == "dark") toggleTheme("dark");
}

function enablePrerender() {
  const prerender = (a) => {
    if (!a.classList.contains('instant')) return;
    const script = document.createElement('script');
    script.type = 'speculationrules';
    script.textContent = JSON.stringify({ prerender: [{ source: 'list', urls: [a.href] }] });
    document.body.append(script);
    a.classList.remove('instant');
  }
  const prefetch = (a) => {
    if (!a.classList.contains('instant')) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = a.href;
    document.head.append(link);
    a.classList.remove('instant');
  }
  const support = HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules');
  const handle = support ? prerender : prefetch;
  document.querySelectorAll('a.instant').forEach(a => {
    if (a.href.endsWith(window.location.pathname)) return;
    let timer;
    a.addEventListener('mouseenter', () => {
      timer = setTimeout(() => handle(a), 50);
    });
    a.addEventListener('mouseleave', () => clearTimeout(timer));
    a.addEventListener('touchstart', () => handle(a), { passive: true });
  });
}

function enableRssMask() {
  const rssBtn = document.querySelector('#rss-btn');
  const mask = document.querySelector('#rss-mask');
  const copyBtn = document.querySelector('#rss-mask button');
  if (!rssBtn || !mask) return;
  rssBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mask.showModal();
  });
  const close = (e) => {
    if (e.target == mask) mask.close();
  };
  mask.addEventListener('click', close);
  const copy = () => {
    navigator.clipboard.writeText(copyBtn.dataset.link).then(() => {
      copyBtn.innerHTML = copyBtn.dataset.checkIcon;
      copyBtn.classList.add('copied');
      copyBtn.removeEventListener('click', copy);
      setTimeout(() => {
        mask.close();
        copyBtn.innerHTML = copyBtn.dataset.copyIcon;
        copyBtn.classList.remove('copied');
        copyBtn.addEventListener('click', copy);
      }, 400);
    });
  }
  copyBtn.addEventListener('click', copy);
}

function enableOutdateAlert() {
  const alert = document.querySelector('#outdate_alert');
  if (!alert) return;
  const publish = document.querySelector('#publish');
  const updated = document.querySelector('#updated');
  const updateDate = new Date(updated ? updated.textContent : publish.textContent);
  const intervalDays = Math.floor((Date.now() - updateDate.getTime()) / (24 * 60 * 60 * 1000));
  const alertDays = parseInt(alert.dataset.days);
  if (intervalDays >= alertDays) {
    const msg = alert.dataset.alertTextBefore + intervalDays + alert.dataset.alertTextAfter;
    alert.querySelector('.content').textContent = msg;
    alert.classList.remove('hidden');
  }
}

function enableTocTooltip() {
  const anchors = document.querySelectorAll('aside nav a');
  if (anchors.length == 0) return;
  const toggleTooltip = () => {
    anchors.forEach(anchor => {
      if (anchor.offsetWidth < anchor.scrollWidth) {
        anchor.setAttribute('title', anchor.textContent);
      } else {
        anchor.removeAttribute('title');
      }
    });
  };
  window.addEventListener('resize', toggleTooltip);
  toggleTooltip();
}

function addCopyBtns() {
  const cfg = document.querySelector('#copy-cfg');
  document.querySelectorAll('.prose pre').forEach(block => {
    const code = block.querySelector('code');
    if (!code || block.classList.contains('mermaid') || block.parentElement.classList.contains('codeblock')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'codeblock';
    const header = document.createElement('div');
    header.className = 'code-header';
    const name = document.createElement('span');
    name.className = 'code-name';
    name.textContent = code.dataset.name || code.dataset.lang || 'text';
    header.append(name);
    if (code.dataset.name && code.dataset.lang) {
      const lang = document.createElement('span');
      lang.className = 'code-language';
      lang.textContent = code.dataset.lang;
      header.append(lang);
    }
    if (cfg) {
      const status = document.createElement('span');
      status.className = 'copy-status';
      status.setAttribute('role', 'status');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy';
      btn.setAttribute('aria-label', 'Copy code');
      btn.title = 'Copy code';
      btn.innerHTML = cfg.dataset.copyIcon;
      let timer;
      btn.addEventListener('click', async () => {
        clearTimeout(timer);
        btn.innerHTML = cfg.dataset.copyIcon;
        status.textContent = '';
        const source = code.cloneNode(true);
        source.querySelectorAll('.giallo-ln').forEach(number => number.remove());
        btn.disabled = true;
        try {
          await navigator.clipboard.writeText(source.textContent);
          btn.innerHTML = cfg.dataset.checkIcon;
        } catch {
          status.textContent = 'Copy failed. Select the code and copy manually.';
        } finally {
          btn.disabled = false;
          timer = setTimeout(() => {
            btn.innerHTML = cfg.dataset.copyIcon;
            status.textContent = '';
          }, 4000);
        }
      });
      header.append(status, btn);
    }
    block.before(wrapper);
    wrapper.append(header, block);
  });
}

function wrapTables() {
  document.querySelectorAll('.prose table').forEach(table => {
    if (table.parentElement.classList.contains('table-scroll')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'table-scroll';
    wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', 'Scrollable table');
    table.before(wrapper);
    wrapper.append(table);
  });
}

function addBackToTopBtn() {
  const backBtn = document.querySelector('#back-to-top');
  if (!backBtn) return;
  const toTop = () => window.scrollTo({ top: 0 });
  const toggle = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 200 && !backBtn.classList.contains('shown')) {
      backBtn.classList.add('shown');
      backBtn.setAttribute('tabindex', 0);
      backBtn.addEventListener('click', toTop);
    } else if (scrollTop <= 200 && backBtn.classList.contains('shown')) {
      backBtn.classList.remove('shown');
      backBtn.setAttribute('tabindex', -1);
      backBtn.removeEventListener('click', toTop);
    }
  };
  window.addEventListener('scroll', toggle);
  toggle();
}

function addFootnoteBacklink() {
  const footnotes = document.querySelectorAll('.footnote-definition');
  footnotes.forEach(footnote => {
    const backlink = document.createElement('button');
    backlink.className = 'backlink';
    backlink.ariaLabel = 'backlink';
    backlink.innerHTML = '↩︎';
    backlink.addEventListener('click', () => window.scrollTo({
      top: document.querySelector(`.footnote-reference a[href="#${footnote.id}"]`).getBoundingClientRect().top + window.scrollY,
    }));
    const lastEl = footnote.lastElementChild || footnote;
    lastEl.appendChild(backlink);
  });
}

function enableImgLightense() {
  window.addEventListener("load", () => Lightense(".prose img:not(.no-lightense)", { background: 'rgba(43, 43, 43, 0.19)' }));
}

function enableBackLink() {
  const backLink = document.querySelector('#back-link');
  if (!backLink) return;
  backLink.addEventListener('click', (e) => {
    if (document.referrer && location.href.startsWith(document.referrer) && !location.hash && history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });
}

enableThemeToggle();
enablePrerender();
enableRssMask();
enableBackLink();
if (document.body.classList.contains('post')) {
  enableOutdateAlert();
  addBackToTopBtn();
  enableTocTooltip();
}
if (document.querySelector('.prose')) {
  addCopyBtns();
  wrapTables();
  addFootnoteBacklink();
  enableImgLightense();
}
