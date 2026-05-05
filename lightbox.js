document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.gallery-item');
  if (items.length === 0) return; // Αν δεν υπάρχουν εικόνες, μην κάνεις τίποτα

  const images = Array.from(items).map(item => item.getAttribute('data-src'));
  const totalImages = images.length;
  let currentIndex = 0;

  // Κλειδαριά για αποτροπή διπλών κλικ/swipes
  let isAnimating = false;

  const lightbox = document.getElementById('lightbox');
  const sliderContainer = document.getElementById('slider-container');
  const slidePrev = document.getElementById('slide-prev');
  const slideCurrent = document.getElementById('slide-current');
  const slideNext = document.getElementById('slide-next');

  // -- Basic Controls --
  items.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  function getIndex(offset) {
    return (currentIndex + offset + totalImages) % totalImages;
  }

  function updateImages() {
    slidePrev.src = images[getIndex(-1)];
    slideCurrent.src = images[currentIndex];
    slideNext.src = images[getIndex(1)];
  }

  function openLightbox(index) {
    currentIndex = index;
    updateImages();

    sliderContainer.style.transition = 'none';
    sliderContainer.style.transform = `translateX(-100%)`;

    lightbox.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
    isAnimating = false;
  }

  // Την κάνουμε global (στο window) για να μπορούν να την καλέσουν τα onclick="" του HTML
  window.closeLightbox = function (forceClose = false) {
    lightbox.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }

  window.handleBackgroundClick = function (e) {
    if (e.target === lightbox || e.target.classList.contains('slide')) {
      closeLightbox();
    }
  }

  window.changeSlide = function (direction) {
    if (isAnimating) return;
    isAnimating = true;

    const targetTranslateX = direction === 1 ? -200 : 0;

    sliderContainer.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    sliderContainer.style.transform = `translateX(${targetTranslateX}%)`;

    setTimeout(() => {
      currentIndex = getIndex(direction);
      updateImages();
      sliderContainer.style.transition = 'none';
      sliderContainer.style.transform = `translateX(-100%)`;

      isAnimating = false;
    }, 400);
  }

  // Keyboard Support
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('opacity-0')) return;
    if (e.key === 'ArrowRight') changeSlide(1);
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'Escape') closeLightbox(true);
  });

  // --- SWIPE / PEEK ΛΟΓΙΚΗ ---
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let startTime = 0;
  let windowWidth = window.innerWidth;

  window.addEventListener('resize', () => { windowWidth = window.innerWidth; });

  lightbox.addEventListener('touchstart', touchStart, { passive: true });
  lightbox.addEventListener('touchmove', touchMove, { passive: false });
  lightbox.addEventListener('touchend', touchEnd);

  lightbox.addEventListener('mousedown', touchStart);
  lightbox.addEventListener('mousemove', touchMove);
  lightbox.addEventListener('mouseup', touchEnd);
  lightbox.addEventListener('mouseleave', () => { if (isDragging) touchEnd() });

  function touchStart(e) {
    if (isAnimating) return;
    if (e.target.tagName.toLowerCase() === 'button') return;

    isDragging = true;
    startX = getPositionX(e);
    startTime = Date.now();
    prevTranslate = -windowWidth;

    sliderContainer.style.transition = 'none';
  }

  function touchMove(e) {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();

    const currentPosition = getPositionX(e);
    const diffX = currentPosition - startX;

    currentTranslate = prevTranslate + diffX;
    sliderContainer.style.transform = `translateX(${currentTranslate}px)`;
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;

    const timeTaken = Date.now() - startTime;
    const diffX = currentTranslate - prevTranslate;
    const velocity = Math.abs(diffX) / timeTaken;

    const movedFar = Math.abs(diffX) > (windowWidth * 0.3);
    const movedFast = velocity > 0.5 && Math.abs(diffX) > 30;

    if (movedFar || movedFast) {
      if (diffX < 0) {
        changeSlide(1);
      } else {
        changeSlide(-1);
      }
    } else {
      sliderContainer.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
      sliderContainer.style.transform = `translateX(-100%)`;
    }
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
});