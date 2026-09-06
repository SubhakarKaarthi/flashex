const logItems = [...document.querySelectorAll('.log-item')];
const currentYear = document.querySelector('#current-year');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

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