let currentSlide = 0;
const totalSlides = 15;

function changeSlide(direction) {
  if (document.getElementById('zoomOverlay').classList.contains('active')) return;
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

// Zoom & Pan functionality
let currentZoom = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;

function openZoom(container) {
  const img = container.querySelector('img');
  if (!img) return;
  const overlay = document.getElementById('zoomOverlay');
  const content = document.getElementById('zoomContent');
  content.innerHTML = `<img id="zoomedImg" src="${img.src}" alt="${img.alt}">`;
  overlay.classList.add('active');
  
  // Reset zoom & pan
  currentZoom = 1;
  panX = 0;
  panY = 0;
  updateZoom();
}

function updateZoom() {
  const img = document.getElementById('zoomedImg');
  if (!img) return;
  img.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
  img.style.transition = isPanning ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)';
}

function zoomIn(e) {
  if (e) e.stopPropagation();
  currentZoom = Math.min(currentZoom + 0.5, 4);
  updateZoom();
}

function zoomOut(e) {
  if (e) e.stopPropagation();
  currentZoom = Math.max(currentZoom - 0.5, 0.5);
  updateZoom();
}

function zoomReset(e) {
  if (e) e.stopPropagation();
  currentZoom = 1;
  panX = 0;
  panY = 0;
  updateZoom();
}

function closeZoom() {
  document.getElementById('zoomOverlay').classList.remove('active');
  setTimeout(() => { document.getElementById('zoomContent').innerHTML = ''; }, 300);
}

// Panning Events
document.addEventListener('mousedown', (e) => {
  if (document.getElementById('zoomOverlay').classList.contains('active') && e.target.id === 'zoomedImg') {
    isPanning = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    e.target.style.cursor = 'grabbing';
    e.preventDefault();
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  panX = e.clientX - startX;
  panY = e.clientY - startY;
  updateZoom();
});

document.addEventListener('mouseup', () => {
  if (isPanning) {
    isPanning = false;
    const img = document.getElementById('zoomedImg');
    if (img) img.style.cursor = 'grab';
  }
});

// Mouse wheel zoom
document.getElementById('zoomOverlay').addEventListener('wheel', (e) => {
  if (document.getElementById('zoomOverlay').classList.contains('active')) {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  }
}, { passive: false });

// Keyboard
document.addEventListener('keydown', (e) => {
  const zoom = document.getElementById('zoomOverlay');
  if (zoom.classList.contains('active')) {
    if (e.key === 'Escape') closeZoom();
    return;
  }
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); changeSlide(1); }
  else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); changeSlide(-1); }
});

// Click overlay background to close
document.getElementById('zoomOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('zoomOverlay')) closeZoom();
});

// Touch
let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', (e) => {
  if (document.getElementById('zoomOverlay').classList.contains('active')) return;
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 60) changeSlide(diff > 0 ? 1 : -1);
});

updateUI();
