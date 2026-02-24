addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Cloudflare Worker that serves a black portrait page with:
 * - centered GIF logo
 * - looping autoplay audio (external MP3)
 * - Manila time display (client-side)
 * - view counter persisted to Workers KV (binding name: VIEWS_KV)
 *
 * IMPORTANT: Bind a KV namespace to this Worker with the variable name "VIEWS_KV"
 * in the Cloudflare dashboard, or the worker will use an in-memory fallback.
 */

// --- CONFIG: update these if you want different sources ---
const SITE_TITLE = "LLC Creative Technologies"
const LOGO_URL = "https://image2url.com/r2/default/gifs/1771931447321-b9c0bd19-ff5c-4d39-8d0a-06b9ab79821e.gif"
const AUDIO_URL = "https://image2url.com/r2/default/audio/1771931706652-c6c30957-9354-46ef-869b-339a6e020cf6.mp3"
const KV_KEY = "views" // key used in KV namespace
// ---------------------------------------------------------

// in-memory fallback counter (not durable)
let fallbackViews = 0

async function getAndIncrementViews() {
  // If KV binding is available, use it
  try {
    if (typeof VIEWS_KV !== "undefined" && VIEWS_KV !== null) {
      // use get and put (simple increment; KV is eventually consistent but fine for view count)
      const current = await VIEWS_KV.get(KV_KEY)
      const n = current ? parseInt(current, 10) : 0
      const next = n + 1
      // write back as string
      await VIEWS_KV.put(KV_KEY, String(next))
      return next
    }
  } catch (e) {
    // KV may not be bound or some error occurred — fall back
    console.warn("KV error or not bound:", e)
  }

  // fallback: in-memory counter (resets when instance restarts)
  fallbackViews = fallbackViews + 1
  return fallbackViews
}

async function handleRequest(request) {
  // Only handle GET for the site root
  if (request.method !== "GET") {
    return new Response(null, { status: 405 })
  }

  const views = await getAndIncrementViews()

  const html = `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
    <title>${escapeHtml(SITE_TITLE)}</title>
    <meta name="theme-color" content="#000000"/>
    <style>
      :root { --bg: #000; --txt: #fff; --muted: rgba(255,255,255,0.8); }
      html,body{height:100%;margin:0;background:var(--bg);color:var(--txt);-webkit-font-smoothing:antialiased;}
      .wrap{
        min-height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        padding:20px;
        box-sizing:border-box;
        text-align:center;
      }
      img.logo{
        width: 280px;
        max-width:78%;
        height:auto;
        display:block;
        border:0;
        box-shadow:none;
        margin:0;
      }
      .title{
        margin-top:12px;
        font-weight:700;
        letter-spacing:0.6px;
        font-size:20px;
      }
      .meta{
        font-size:13px;
        color:var(--muted);
        margin-top:6px;
      }
      .info-row{
        position:fixed;
        left:0;
        right:0;
        bottom:14px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        max-width:960px;
        margin:0 auto;
        padding:0 18px;
        box-sizing:border-box;
        font-size:13px;
        color:var(--muted);
      }
      .pill{
        background: rgba(255,255,255,0.02);
        padding:8px 12px;
        border-radius:999px;
      }
      /* small accessibility: allow tapping the logo to toggle playback */
      .logo{ touch-action: manipulation; cursor: pointer; }
      @media (min-width:520px){ img.logo{ width:320px; } .title{ font-size:22px; } }
    </style>
  </head>
  <body>
    <main class="wrap" role="main" aria-label="${escapeHtml(SITE_TITLE)}">
      <img id="logo" class="logo" src="${escapeHtml(LOGO_URL)}" alt="${escapeHtml(SITE_TITLE)} logo">
      <div class="title">${escapeHtml(SITE_TITLE)}</div>
      <div class="meta">Portrait-friendly • Manila time • Looping background audio</div>
    </main>

    <div class="info-row" aria-hidden="false">
      <div class="pill" id="timeBox">${new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", hour12:true, year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' })}</div>
      <div class="pill">👁 ${views}</div>
    </div>

    <!-- audio element: attempts unmuted autoplay and loops -->
    <audio id="bgAudio" autoplay loop playsinline preload="auto" crossorigin="anonymous">
      <source src="${escapeHtml(AUDIO_URL)}" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <script>
      // Live Manila time update (client-side)
      function updateTime() {
        const opts = { timeZone: 'Asia/Manila', hour12: true, year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' };
        document.getElementById('timeBox').textContent = new Date().toLocaleString('en-PH', opts);
      }
      setInterval(updateTime, 1000);
      updateTime();

      // Audio play logic: try unmuted autoplay; if blocked, wait for first gesture (invisible) to start
      const audio = document.getElementById('bgAudio');
      async function tryPlayUnmuted() {
        try {
          audio.muted = false;
          await audio.play();
          console.log('Audio playing unmuted');
          return true;
        } catch (err) {
          console.warn('Unmuted autoplay blocked:', err);
          return false;
        }
      }

      window.addEventListener('load', async () => {
        const ok = await tryPlayUnmuted();
        if (!ok) {
          // attempt muted autoplay (some browsers allow this) — we don't want muted, but this can prime playback
          try {
            audio.muted = true;
            await audio.play();
            console.log('Muted autoplay succeeded (primed). Will wait for user gesture to unmute.');
          } catch (e) {
            console.warn('Muted autoplay also blocked:', e);
          }

          // attach a one-time gesture listener (tap/click) to start audio unmuted
          function onFirstGesture() {
            audio.muted = false;
            audio.play().catch(()=>{});
            removeListeners();
          }
          function removeListeners() {
            document.removeEventListener('pointerdown', onFirstGesture);
            document.removeEventListener('touchstart', onFirstGesture);
            document.removeEventListener('click', onFirstGesture);
          }
          document.addEventListener('pointerdown', onFirstGesture, { once: true, passive: true });
          document.addEventListener('touchstart', onFirstGesture, { once: true, passive: true });
          document.addEventListener('click', onFirstGesture, { once: true, passive: true });
        }
      });

      // optional: toggle play/pause by tapping logo
      const logo = document.getElementById('logo');
      logo.addEventListener('click', () => {
        if (audio.paused) audio.play().catch(()=>{});
        else audio.pause();
      }, { passive: true });
    </script>

  </body>
  </html>`

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // small cache-control: don't cache so view counter increments on each fetch
      "cache-control": "no-store, private, max-age=0"
    }
  })
}

/** Simple helper to escape text included in HTML template */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
