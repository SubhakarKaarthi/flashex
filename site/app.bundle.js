(()=>{var j=()=>{window.si||(window.si=function(...r){window.siq=window.siq||[],window.siq.push(r)})},A="@vercel/speed-insights",I="2.0.0";function L(){return typeof window<"u"}function R(){try{let e="production";if(e==="development"||e==="test")return"development"}catch{}return"production"}function f(){return R()==="development"}function x(e){return e.scriptSrc?d(e.scriptSrc):f()?"https://va.vercel-scripts.com/v1/speed-insights/script.debug.js":e.dsn?"https://va.vercel-scripts.com/v1/speed-insights/script.js":e.basePath?d(`${e.basePath}/speed-insights/script.js`):"/_vercel/speed-insights/script.js"}function C(e,r){var n;let t=e;if(r)try{t={...(n=JSON.parse(r))==null?void 0:n.speedInsights,...e}}catch{}let o={sdkn:A+(t.framework?`/${t.framework}`:""),sdkv:I};return t.sampleRate&&(o.sampleRate=t.sampleRate.toString()),t.route&&(o.route=t.route),f()&&t.debug===!1&&(o.debug="false"),t.dsn&&(o.dsn=t.dsn),t.endpoint?o.endpoint=d(t.endpoint):t.basePath&&(o.endpoint=d(`${t.basePath}/speed-insights/vitals`)),{src:x(t),beforeSend:t.beforeSend,dataset:o}}function d(e){return e.startsWith("http://")||e.startsWith("https://")||e.startsWith("/")?e:`/${e}`}function p(e={},r){var n;if(!L()||e.route===null)return null;j();let{beforeSend:t,src:o,dataset:c}=C(e,r);if(document.head.querySelector(`script[src*="${o}"]`))return null;t&&((n=window.si)==null||n.call(window,"beforeSend",t));let s=document.createElement("script");s.src=o,s.defer=!0;for(let[m,P]of Object.entries(c))s.dataset[m]=P;return s.onerror=()=>{console.log(`[Vercel Speed Insights] Failed to load script from ${o}. Please check if any content blockers are enabled and try again.`)},document.head.appendChild(s),{setRoute:m=>{s.dataset.route=m??void 0}}}p();var l=[...document.querySelectorAll(".log-item")],h=document.querySelector("#current-year"),u=document.querySelector(".theme-toggle"),v=document.querySelector('meta[name="theme-color"]'),i=document.querySelector("[data-install]"),T=document.querySelector("#demo-form"),D=document.querySelector("#demo-prompt"),O=document.querySelector("#demo-board"),g=document.querySelector("#demo-status"),b=document.querySelector("#demo-project"),S=document.querySelector("#demo-board-output"),w=document.querySelector("#demo-sketch"),y=document.querySelector("#demo-libraries"),k=document.querySelector("#demo-code code"),a=null;"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(e=>{console.warn("Service worker registration failed:",e)})});window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),a=e,i&&(i.hidden=!1,i.setAttribute("aria-hidden","false"))});i&&i.addEventListener("click",async()=>{a&&(a.prompt(),await a.userChoice,a=null,i.hidden=!0)});function _(){let e=document.documentElement.dataset.theme;return e==="dark"||e==="light"?e:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function $(e){if(document.documentElement.dataset.theme=e,u){let r=e==="dark"?"light":"dark";u.setAttribute("aria-label",`Switch to ${r} mode`),u.setAttribute("title",`Switch to ${r} mode`)}v&&v.setAttribute("content",e==="dark"?"#111923":"#1f5a95")}$(_());u?.addEventListener("click",()=>{let e=_()==="dark"?"light":"dark";$(e);try{localStorage.setItem("flashex-theme",e)}catch{}});h&&(h.textContent=new Date().getFullYear());var E={ESP32:{library:"DHT sensor library",slug:"esp32_weather",code:`void setup() {
  Serial.begin(115200);
  // Initialise Wi-Fi and the DHT22 sensor.
}

void loop() {
  // Read the sensor and serve the latest values.
}`},"Arduino Uno":{library:"LiquidCrystal + DHT sensor library",slug:"uno_sensor_dashboard",code:`void setup() {
  Serial.begin(9600);
  // Initialise the sensor and display.
}

void loop() {
  // Read, format, and display the sensor values.
}`},"Arduino Nano":{library:"DHT sensor library",slug:"nano_sensor_monitor",code:`void setup() {
  Serial.begin(9600);
  // Initialise the sensor pins.
}

void loop() {
  // Read and report sensor values.
}`},RP2040:{library:"Adafruit Unified Sensor",slug:"rp2040_environment_monitor",code:`void setup() {
  Serial.begin(115200);
  // Initialise the RP2040 peripherals.
}

void loop() {
  // Sample the environment and report results.
}`}};T?.addEventListener("submit",e=>{e.preventDefault();let r=O?.value||"ESP32",n=E[r]||E.ESP32,c=(D?.value.trim()||"hardware_project").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"").slice(0,24)||n.slug;g&&(g.textContent="Plan generated locally"),b&&(b.textContent=c),S&&(S.textContent=r),w&&(w.textContent=`${c}.ino`),y&&(y.textContent=n.library),k&&(k.textContent=n.code)});var q=document.querySelectorAll(".reveal");if("IntersectionObserver"in window){let e=new IntersectionObserver((r,n)=>{r.forEach(t=>{t.isIntersecting&&(t.target.classList.add("is-visible"),n.unobserve(t.target))})},{threshold:.12});q.forEach(r=>e.observe(r))}else q.forEach(e=>e.classList.add("is-visible"));var W=window.matchMedia("(prefers-reduced-motion: reduce)").matches;W||(l.forEach((e,r)=>{r!==l.length-1&&e.classList.remove("is-done")}),l.forEach((e,r)=>{window.setTimeout(()=>{e.classList.add("is-done"),e.classList.remove("is-active");let n=l[r+1];n&&n.classList.add("is-active")},1500+r*850)}));})();
