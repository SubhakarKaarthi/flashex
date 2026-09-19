import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

const logItems = [...document.querySelectorAll('.log-item')];
const currentYear = document.querySelector('#current-year');
const themeToggle = document.querySelector('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const installButton = document.querySelector('[data-install]');
const demoForm = document.querySelector('#demo-form');
const demoPrompt = document.querySelector('#demo-prompt');
const demoBoard = document.querySelector('#demo-board');
const demoStatus = document.querySelector('#demo-status');
const demoProject = document.querySelector('#demo-project');
const demoBoardOutput = document.querySelector('#demo-board-output');
const demoSketch = document.querySelector('#demo-sketch');
const demoLibraries = document.querySelector('#demo-libraries');
const demoCode = document.querySelector('#demo-code code');
let deferredPrompt = null;

try {
  const savedTheme = localStorage.getItem('flashex-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch {}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (installButton) {
    installButton.hidden = false;
    installButton.setAttribute('aria-hidden', 'false');
  }
});

if (installButton) {
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installButton.hidden = true;
  });
}

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
  if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#111923' : '#1f5a95');
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

const demoProfiles = {
  ESP32: { library: 'DHT sensor library', slug: 'esp32_weather', code: 'void setup() {\n  Serial.begin(115200);\n  // Initialise Wi-Fi and the DHT22 sensor.\n}\n\nvoid loop() {\n  // Read the sensor and serve the latest values.\n}' },
  'Arduino Uno': { library: 'LiquidCrystal + DHT sensor library', slug: 'uno_sensor_dashboard', code: 'void setup() {\n  Serial.begin(9600);\n  // Initialise the sensor and display.\n}\n\nvoid loop() {\n  // Read, format, and display the sensor values.\n}' },
  'Arduino Nano': { library: 'DHT sensor library', slug: 'nano_sensor_monitor', code: 'void setup() {\n  Serial.begin(9600);\n  // Initialise the sensor pins.\n}\n\nvoid loop() {\n  // Read and report sensor values.\n}' },
  RP2040: { library: 'Adafruit Unified Sensor', slug: 'rp2040_environment_monitor', code: 'void setup() {\n  Serial.begin(115200);\n  // Initialise the RP2040 peripherals.\n}\n\nvoid loop() {\n  // Sample the environment and report results.\n}' }
};

demoForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const board = demoBoard?.value || 'ESP32';
  const profile = demoProfiles[board] || demoProfiles.ESP32;
  const prompt = demoPrompt?.value.trim() || 'hardware_project';
  const promptSlug = prompt.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 24);
  const projectName = promptSlug || profile.slug;

  if (demoStatus) demoStatus.textContent = 'Plan generated locally';
  if (demoProject) demoProject.textContent = projectName;
  if (demoBoardOutput) demoBoardOutput.textContent = board;
  if (demoSketch) demoSketch.textContent = `${projectName}.ino`;
  if (demoLibraries) demoLibraries.textContent = profile.library;
  if (demoCode) demoCode.textContent = profile.code;
});

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