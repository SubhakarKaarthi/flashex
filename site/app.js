const logItems = [...document.querySelectorAll('.log-item')];
const currentYear = document.querySelector('#current-year');
const themeToggle = document.querySelector('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function getPreferredTheme() {
  const savedTheme = document.documentElement.dataset.theme;
  if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeToggle) {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    themeToggle.setAttribute('title', `Switch to ${nextTheme} mode`);
  }
  if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#111923' : '#007fff');
}

updateTheme(getPreferredTheme());

themeToggle?.addEventListener('click', () => {
  const nextTheme = getPreferredTheme() === 'dark' ? 'light' : 'dark';
  updateTheme(nextTheme);
  try {
    localStorage.setItem('flashex-theme', nextTheme);
  } catch {}
});

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  logItems.forEach((item, index) => {
    if (index === logItems.length - 1) return;
    item.classList.remove('is-done');
  });

  logItems.forEach((item, index) => {
    window.setTimeout(() => {
      item.classList.add('is-done');
      item.classList.remove('is-active');
      const nextItem = logItems[index + 1];
      if (nextItem) nextItem.classList.add('is-active');
    }, 1500 + (index * 850));
  });
}