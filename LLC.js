addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

const SITE_TITLE = "LLC Creative Technologies"
const LOGO_URL = "https://image2url.com/r2/default/gifs/1771931447321-b9c0bd19-ff5c-4d39-8d0a-06b9ab79821e.gif"
const AUDIO_URL = "https://image2url.com/r2/default/audio/1771931706652-c6c30957-9354-46ef-869b-339a6e020cf6.mp3"
const KV_KEY = "views"

let fallbackViews = 0

async function getAndIncrementViews() {
  try {
    if (typeof VIEWS_KV !== "undefined") {
      const current = await VIEWS_KV.get(KV_KEY)
      const n = current ? parseInt(current, 10) : 0
      const next = n + 1
      await VIEWS_KV.put(KV_KEY, String(next))
      return next
    }
  } catch (e) {}

  fallbackViews++
  return fallbackViews
}

async function handleRequest(request) {
  const views = await getAndIncrementViews()

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${SITE_TITLE}</title>

<style>
body{
  margin:0;
  background:#000;
  color:#fff;
  font-family:Arial, sans-serif;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  height:100vh;
  text-align:center;
  overflow:hidden;
}

.logo{
  width:260px;
  max-width:80%;
}

.title{
  margin-top:12px;
  font-size:22px;
  font-weight:bold;
}

.bots{
  margin-top:15px;
  display:flex;
  flex-direction:column;
  gap:10px;
}

/* Shared bot style */
.bot-link{
  text-decoration:none;
  font-weight:bold;
  font-size:15px;
  position:relative;
  padding:6px 12px;
  border-radius:6px;
  overflow:hidden;
}

/* Bot 1 - White/Red Glow */
.bot1{
  background:linear-gradient(270deg,#ffffff,#ff0000,#ffffff);
  background-size:600% 600%;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  animation:moveLeft 4s linear infinite;
  text-shadow:0 0 8px red;
}

/* Bot 2 - Violet Blue Pink (no glow) */
.bot2{
  background:linear-gradient(270deg,violet,blue,pink,violet);
  background-size:600% 600%;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  animation:moveLeft 5s linear infinite;
}

@keyframes moveLeft{
  0%{background-position:100% 50%;}
  100%{background-position:0% 50%;}
}

.info{
  position:fixed;
  bottom:45px;
  width:100%;
  display:flex;
  justify-content:space-around;
  font-size:13px;
  opacity:0.8;
}

.footer{
  position:fixed;
  bottom:10px;
  font-size:12px;
  opacity:0.6;
}
</style>
</head>
<body>

<img src="${LOGO_URL}" class="logo">

<div class="title">${SITE_TITLE}</div>

<div class="bots">
  <a class="bot-link bot1" href="https://t.me/globanllcbot_bot" target="_blank">
    @globanllcbot_bot
  </a>

  <a class="bot-link bot2" href="https://t.me/funmatchjrllc_bot" target="_blank">
    @funmatchjrllc_bot
  </a>
</div>

<div class="info">
  <div id="time"></div>
  <div>👁 ${views}</div>
</div>

<div class="footer">
  Powered by L © 2026 LLC Tech Corporation
</div>

<audio id="bgAudio" autoplay loop playsinline>
  <source src="${AUDIO_URL}" type="audio/mpeg">
</audio>

<script>
// Manila time
function updateTime(){
  const opt={
    timeZone:'Asia/Manila',
    hour12:true,
    year:'numeric',
    month:'long',
    day:'2-digit',
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit'
  };
  document.getElementById("time").innerHTML=
    new Date().toLocaleString("en-PH",opt);
}
setInterval(updateTime,1000);
updateTime();

// Force audio play
const audio=document.getElementById("bgAudio");
window.addEventListener("load",()=>{
  audio.play().catch(()=>{
    document.addEventListener("click",()=>{
      audio.play();
    },{once:true});
  });
});
</script>

</body>
</html>
`

  return new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" }
  })
}
