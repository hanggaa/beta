let currentSlide = 0;
const totalSlides = 12;

function changeSlide(direction) {
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); changeSlide(1); }
  else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); changeSlide(-1); }
});

let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 60) changeSlide(diff > 0 ? 1 : -1);
});

updateUI();
