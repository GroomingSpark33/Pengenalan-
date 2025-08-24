const tracks = [
  { title:'penjaga hati', artist:'Nadhif Basalamah', cover:'covers/penjaga-hati.jpg', src:'music/penjaga-hati.mp3', lyrics:'lyrics/penjaga-hati.txt'},

  { title:'bergema sampai selamanya', artist:'Nadhif Basalamah', cover:'covers/bergema.jpg', src:'music/bergema.mp3' },
  
  { title:'123456', artist:'Budi Doremi', cover:'covers/123456.jpg', src:'music/123456.mp3' },
  { title:'Tahta Hatiku #Pendampingmu', artist:'Fajar Noor', cover:'covers/tahta-hatiku.jpg', src:'music/tahta-hatiku.mp3' },
  { title:'Pendampingmu #TahtaHatiku', artist:'Shabrina Leanor', cover:'covers/pendampingmu.jpg', src:'music/pendampingmu.mp3' },
  { title:'Lantas', artist:'Juicy Luicy', cover:'covers/lantas.jpg', src:'music/lantas.mp3' },
  { title: 'Jiwa Yang Bersedih', artist:'Ghea indrawari', cover:'covers/jiwa-yang-bersedih.jpg', src:'music/jiwa-yang-bersedih.mp3'},
  { title:'Akhir tak bahagia', artist:'Misellia', cover:'covers/akhir-tak-bahagia.jpg', src:'music/akhir-tak-bahagia.mp3'}
];
const listEl = document.getElementById('list');
const floatToggle = document.getElementById('floatToggle');
const toggleBtn = document.getElementById('toggleBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const miniCover = document.getElementById('miniCover');
const miniTitle = document.getElementById('miniTitle');
const miniArtist = document.getElementById('miniArtist');
const progressEl = document.getElementById('progress');
const seekbar = document.getElementById('seekbar');
let currentIndex = 0;
const audio = new Audio();
audio.preload = 'metadata';
function renderList(){
  listEl.innerHTML = '';
  tracks.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <img src="${t.cover}" class="cover" alt="">
      <div class="meta">
        <div class="title">${t.title}</div>
        <div class="artist">${t.artist}</div>
      </div>
      <div class="actions">
        <button class="play-btn" data-idx="${i}" aria-label="Play/Pause"><i class="fa-solid fa-play"></i></button>
        <i class="fa-solid fa-ellipsis-vertical dots"></i>
      </div>
    `;
    listEl.appendChild(row);
  });
}
renderList();
function load(i){
  currentIndex = i;
  const t = tracks[i];
  audio.src = t.src;
  audio.load();
  miniCover.src = t.cover;
  miniTitle.textContent = t.title;
  miniArtist.textContent = t.artist;
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: t.title, artist: t.artist, artwork: [{src:t.cover, sizes:'512x512', type:'image/jpeg'}]
    });
    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', pause);
    navigator.mediaSession.setActionHandler('previoustrack', prev);
    navigator.mediaSession.setActionHandler('nexttrack', next);
    navigator.mediaSession.setActionHandler('seekto', (d)=>{ if (audio.duration) audio.currentTime = d.seekTime; });
  }
  updateButtons();
}
function play(){
  audio.play().catch(()=>{});
  floatToggle.classList.remove('paused'); floatToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
  toggleBtn.classList.remove('paused'); toggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  const btn = document.querySelector('.play-btn[data-idx="'+currentIndex+'"]');
  if (btn){ btn.classList.add('active'); btn.innerHTML = '<i class="fa-solid fa-pause"></i>'; }
}
function pause(){
  audio.pause();
  floatToggle.classList.add('paused'); floatToggle.innerHTML = '<i class="fa-solid fa-play"></i>';
  toggleBtn.classList.add('paused'); toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  const btn = document.querySelector('.play-btn[data-idx="'+currentIndex+'"]');
  if (btn){ btn.classList.remove('active'); btn.innerHTML = '<i class="fa-solid fa-play"></i>'; }
}
function next(){ const i=(currentIndex+1)%tracks.length; load(i); play(); }
function prev(){ const i=(currentIndex-1+tracks.length)%tracks.length; load(i); play(); }
function updateButtons(){
  document.querySelectorAll('.play-btn').forEach(b=>{ b.classList.remove('active'); b.innerHTML='<i class="fa-solid fa-play"></i>'; });
}
listEl.addEventListener('click', (e)=>{
  const btn = e.target.closest('.play-btn'); if (!btn) return;
  const idx = +btn.dataset.idx;
  if (idx !== currentIndex){ load(idx); play(); return; }
  if (audio.paused) play(); else pause();
});
toggleBtn.addEventListener('click', ()=> audio.paused ? play() : pause());
floatToggle.addEventListener('click', ()=> audio.paused ? play() : pause());
prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
audio.addEventListener('timeupdate', ()=>{
  if (!isFinite(audio.duration)) return;
  progressEl.style.width = (audio.currentTime / audio.duration * 100) + '%';
});
seekbar.addEventListener('click', (e)=>{
  const r = seekbar.getBoundingClientRect();
  const pct = (e.clientX - r.left) / r.width;
  if (audio.duration) audio.currentTime = pct * audio.duration;
});
audio.addEventListener('ended', next);
load(0);