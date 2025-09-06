/* ===== Personal letters =====
   You can edit these any time. Keep text warm and simple.
   No dashes as requested previously.
*/
const LETTERS = {
  miss: {
    title: "Open when you miss me",
    text: `My Soumaya
I know you miss me right now. Close your eyes for a second and breathe with me. Think about our walks near the sea , and the way your hand felt in mine, merging together like they were meant to be stuck eternally , which they were . I am building a life that fits your smile, and throughout that I always will be proud of you and grateful for you. And remember 7bibti I am always here.`
  },
  sad: {
    title: "Open when you are sad",
    text: `My love
If tears are heavy let them fall. I will collect every one and trade them for tiny moments of joy. Remember how strong you are , how strong we are , but also remember how gentle you are so be gentle on yourself as well baby . Your heart is a home and I am blessed to live in it , so don't let anything break it because they'll be breaking my safe space . I will always choose you and be there for you my baby and any negativity I am here to fix it just communicate it my love.`
  },
  smile: {
    title: "Open when you want to smile",
    text: `Princess
Think about the first time you made me laugh so hard I forgot every worry. Think about the way you raise your eyebrows when you win an argument. Think about our future kitchen and the little notes on the fridge. Your smile is my favorite place.`
  },
  sleep: {
    title: "Open when you cannot sleep",
    text: `Close your eyes my star
Imagine us sitting together in our sea spot and count the waves on the shore baby. One wave says I love you. The next says I am here. The next says forever. I will hold you in every dream. Rest now. I am watching the same sky and thinking of you and I'll always be.`
  },
  loved: {
    title: "Open when you want to feel loved",
    text: `Soumaya
You are my calm and my fire. You make my thoughts clear and my heart steady. You turned my future into a beautiful plan. I want to become more for you every day. I am yours. Always.`
  },
  secret: {
    title: "My secret letter to you",
    text: `Soumaya
Before you came I felt alone in a crowd and heavy with silence. You arrived like the right answer after a long exam. You gave me purpose and peace. I dream of a beautiful home and a perfect life full of tiny rituals that keep our love safe. I want four little ones who learn kindness by watching us. I want long mornings and warm evenings. I want to carry the weight for you so your steps feel light. When you doubt yourself read this line slowly. You are the best thing that ever happened to me. I promise to protect your heart with patience with loyalty with effort and with joy. I will be your home for the rest of my life.`
  }
};

/* ===== Secret password settings =====
   Change this to your shared secret. Keep it simple.
   Example ideas: "2024-10-12", a nickname, or the place you first met.
*/
const SECRET_PASSWORD = "Lilya";   // change if you like
const SECRET_HINT = "Our future daughter's name";

/* ===== DOM ===== */
const modal = document.getElementById("letterModal");
const letterTitle = document.getElementById("letterTitle");
const letterContent = document.getElementById("letterContent");
const closeModal = document.getElementById("closeModal");
const markBtn = document.getElementById("markBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const passModal = document.getElementById("passModal");
const passInput = document.getElementById("passInput");
const passConfirm = document.getElementById("passConfirm");
const passCancel = document.getElementById("passCancel");
const passHint = document.getElementById("passHint");

const playBtn = document.getElementById("playBtn");
const player = document.getElementById("player");
const playingState = document.getElementById("playingState");

/* Track reading state */
const KEY_READ = "openwhen_read"; // localStorage
const opened = new Set(JSON.parse(localStorage.getItem(KEY_READ) || "[]"));

/* Envelope click handling */
const order = ["miss", "sad", "smile", "sleep", "loved", "secret"];
const envelopes = [...document.querySelectorAll(".envelope")];

let current = null;

envelopes.forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.letter;
    if (key === "secret") {
      passHint.textContent = "";
      passInput.value = "";
      passModal.showModal();
      setTimeout(()=>passInput.focus(), 30);
    } else {
      openLetter(key);
    }
  });
});

function openLetter(key){
  current = key;
  letterTitle.textContent = LETTERS[key].title;
  letterContent.textContent = LETTERS[key].text;
  modal.showModal();
  updateNavButtons();
}

function updateNavButtons(){
  const idx = order.indexOf(current);
  prevBtn.disabled = idx <= 0;
  nextBtn.disabled = idx >= order.length - 1;
  markBtn.textContent = opened.has(current) ? "Marked as read" : "Mark as read";
}

/* Close */
closeModal.addEventListener("click", ()=> modal.close());

/* Mark as read */
markBtn.addEventListener("click", ()=>{
  if (!current) return;
  opened.add(current);
  localStorage.setItem(KEY_READ, JSON.stringify([...opened]));
  markBtn.textContent = "Marked as read";
  pulse(current);
});

/* Navigate */
prevBtn.addEventListener("click", ()=>{
  const i = Math.max(0, order.indexOf(current)-1);
  openLetter(order[i]);
});
nextBtn.addEventListener("click", ()=>{
  const i = Math.min(order.length-1, order.indexOf(current)+1);
  openLetter(order[i]);
});

/* Secret unlock */
passConfirm.addEventListener("click", tryUnlock);
passInput.addEventListener("keydown", e=>{ if(e.key==="Enter") tryUnlock(); });
passCancel.addEventListener("click", ()=> passModal.close());

function tryUnlock(){
  const pass = passInput.value.trim();
  if(pass === SECRET_PASSWORD){
    passModal.close();
    openLetter("secret");
  }else{
    passHint.textContent = "That did not work. Hint: " + SECRET_HINT;
    passHint.style.color = "var(--danger)";
  }
}

/* Tiny success pulse on envelope when marked */
function pulse(key){
  const el = envelopes.find(e=>e.dataset.letter===key);
  if (!el) return;
  el.animate([{transform:"scale(1)"},{transform:"scale(1.03)"},{transform:"scale(1)"}],
             {duration:380, easing:"ease-out"});
}

/* Audio button: click to play or pause Apocalypse */
let isPlaying = false;
function updateAudioUI(){
  playingState.textContent = isPlaying ? "Playing now" : "";
  playBtn.textContent = isPlaying ? "Pause “Apocalypse”" : "Play “Apocalypse”";
}
playBtn.addEventListener("click", async ()=>{
  try{
    if (!isPlaying){
      await player.play();
      isPlaying = true;
    }else{
      player.pause();
      isPlaying = false;
    }
  }catch(err){
    playingState.textContent = "Could not start audio";
  }
  updateAudioUI();
});
player.addEventListener("ended", ()=>{ isPlaying=false; updateAudioUI(); });

/* Optional: mark already read items on load by dimming label */
window.addEventListener("load", ()=>{
  opened.forEach(key=>{
    const el = envelopes.find(e=>e.dataset.letter===key);
    if (el) el.querySelector(".label").style.color = "var(--muted)";
  });
  updateAudioUI();
});
