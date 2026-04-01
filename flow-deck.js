let currentSlide = 0;
const totalSlides = 13;

// Carousel data
const carImages = [
  { file: "1. Entitas & Relasi.png", title: "Entitas & Relasi" },
  { file: "2. Alur Normal Mitra1000s (Tidak Ada Keterlambatan).png", title: "Alur Normal Mitra1000s" },
  { file: "3. Alur Tidak Normal Mitra1000s (Telat Bayar, TANPA Fintech1000s).png", title: "Alur Tidak Normal (Tanpa Fintech1000s)" },
  { file: "4. Solusi Fintech1000s Perpanjangan Tempo (Sekali).png", title: "Solusi Fintech1000s (Sekali)" },
  { file: "5. Fintech1000s Perpanjangan Tempo BERULANG (Re-Extension).png", title: "Perpanjangan Berulang (Re-Extension)" },
  { file: "6. Alur Normal (Tidak Ada Keterlambatan).png", title: "Sequence: Alur Normal" },
  { file: "7. Alur Tidak Normal (TANPA Fintech1000s).png", title: "Sequence: Tidak Normal" },
  { file: "8. Solusi Fintech1000s (Perpanjangan Tempo + Cicilan).png", title: "Sequence: Fintech1000s + Cicilan" },
  { file: "9. Fintech1000s Re-Extension (Perpanjang Tempo Berulang).png", title: "Sequence: Re-Extension" }
];
let currentCar = 0;

// Build dots
const dotsEl = document.getElementById('carDots');
if (dotsEl) {
  carImages.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'car-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => { currentCar = i; updateCar(); };
    dotsEl.appendChild(dot);
  });
}

function navCar(dir) {
  currentCar = (currentCar + dir + carImages.length) % carImages.length;
  updateCar();
}

function updateCar() {
  const img = carImages[currentCar];
  const carImg = document.getElementById('carImg');
  if (carImg) {
    carImg.style.opacity = '0';
    carImg.style.transform = 'scale(0.95)';
    setTimeout(() => {
      carImg.src = img.file;
      carImg.alt = img.title;
      carImg.style.opacity = '1';
      carImg.style.transform = 'scale(1)';
    }, 150);
  }
  const carNum = document.getElementById('carNum');
  const carName = document.getElementById('carName');
  const carCounter = document.getElementById('carCounter');
  if (carNum) carNum.textContent = currentCar + 1;
  if (carName) carName.textContent = img.title;
  if (carCounter) carCounter.textContent = `${currentCar + 1} / ${carImages.length}`;
  // Update dots
  document.querySelectorAll('.car-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentCar);
  });
}

// Slide navigation
function changeSlide(direction) {
  if (document.getElementById('lbOverlay').classList.contains('active')) return;
  const slides = document.querySelectorAll('.slide');
  const current = slides[currentSlide];
  const nextIndex = currentSlide + direction;
  if (nextIndex < 0 || nextIndex >= totalSlides) return;
  const next = slides[nextIndex];
  if (direction > 0) {
    current.classList.remove('active');
    current.classList.add('exit-left');
    next.classList.add('active');
  } else {
    current.classList.remove('active');
    current.style.transform = 'translateX(50px)';
    current.style.opacity = '0';
    next.classList.remove('exit-left');
    next.classList.add('active');
    setTimeout(() => { current.style.transform = ''; current.style.opacity = ''; }, 50);
  }
  currentSlide = nextIndex;
  updateUI();
}

function updateUI() {
  document.getElementById('slideCounter').textContent = `${currentSlide + 1} / ${totalSlides}`;
  document.getElementById('prevBtn').disabled = currentSlide === 0;
  document.getElementById('nextBtn').disabled = currentSlide === totalSlides - 1;
  document.getElementById('progressBar').style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
}

// Keyboard: carousel slide (11) uses arrows for carousel, lightbox uses arrows too
const GALLERY_SLIDE = 11;

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lbOverlay');
  // Lightbox open: arrows for lightbox
  if (lb.classList.contains('active')) {
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') navLb(-1);
    else if (e.key === 'ArrowRight') navLb(1);
    return;
  }
  // On gallery slide: arrows for carousel
  if (currentSlide === GALLERY_SLIDE) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); navCar(-1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); navCar(1); return; }
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); changeSlide(1); return; }
    if (e.key === 'Backspace') { e.preventDefault(); changeSlide(-1); return; }
    return;
  }
  // Normal slide nav
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); changeSlide(1); }
  else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); changeSlide(-1); }
});

// Touch
let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) < 60) return;
  if (currentSlide === GALLERY_SLIDE && !document.getElementById('lbOverlay').classList.contains('active')) {
    navCar(diff > 0 ? 1 : -1);
  } else {
    changeSlide(diff > 0 ? 1 : -1);
  }
});

// Lightbox
function openLb(i) {
  currentCar = i; // sync
  updateCar();
  document.getElementById('lbImg').src = carImages[i].file;
  document.getElementById('lbImg').alt = carImages[i].title;
  document.getElementById('lbTitle').textContent = carImages[i].title;
  document.getElementById('lbCounter').textContent = `${i + 1} / ${carImages.length}`;
  document.getElementById('lbOverlay').classList.add('active');
}
function closeLb() {
  document.getElementById('lbOverlay').classList.remove('active');
}
function navLb(dir) {
  currentCar = (currentCar + dir + carImages.length) % carImages.length;
  const img = carImages[currentCar];
  document.getElementById('lbImg').src = img.file;
  document.getElementById('lbImg').alt = img.title;
  document.getElementById('lbTitle').textContent = img.title;
  document.getElementById('lbCounter').textContent = `${currentCar + 1} / ${carImages.length}`;
  updateCar(); // sync carousel
}
document.getElementById('lbOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('lbOverlay')) closeLb();
});

updateUI();
