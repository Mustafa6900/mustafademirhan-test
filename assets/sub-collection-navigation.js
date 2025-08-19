/**
 * Sub-Collection Navigation JavaScript
 * Handles scrolling, dropdown functionality, and touch interactions
 */

function scrollSubCollection(direction) {
  const container = document.getElementById('sub-collection-scroll');
  if (!container) return;
  
  const containerWidth = container.offsetWidth;
  const scrollAmount = containerWidth * 0.8;
  
  let targetScroll;
  if (direction === 'left') {
    targetScroll = Math.max(0, container.scrollLeft - scrollAmount);
  } else {
    const maxScroll = container.scrollWidth - containerWidth;
    targetScroll = Math.min(maxScroll, container.scrollLeft + scrollAmount);
  }
  
  container.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  });
}

document.addEventListener('DOMContentLoaded', function() {
  
  // Navigation Controls
  const prevButtons = document.querySelectorAll('.sub-collection-navigation__control-btn--prev');
  const nextButtons = document.querySelectorAll('.sub-collection-navigation__control-btn--next');
  
  prevButtons.forEach(button => {
    button.addEventListener('click', () => scrollSubCollection('left'));
  });
  
  nextButtons.forEach(button => {
    button.addEventListener('click', () => scrollSubCollection('right'));
  });

  const allControlButtons = document.querySelectorAll('.sub-collection-navigation__control-btn[data-direction]');
  allControlButtons.forEach(button => {
    button.addEventListener('click', function() {
      const direction = this.getAttribute('data-direction');
      scrollSubCollection(direction);
    });
  });

  // Custom Dropdown Functionality
  const dropdownBtns = document.querySelectorAll('.sub-collection-navigation__dropdown-btn');
  const dropdownMenus = document.querySelectorAll('.sub-collection-navigation__dropdown-menu');
  const dropdownTexts = document.querySelectorAll('.sub-collection-navigation__dropdown-text');

  dropdownBtns.forEach((dropdownBtn, index) => {
    const dropdownMenu = dropdownMenus[index];
    const dropdownText = dropdownTexts[index];
    
    if (dropdownBtn && dropdownMenu) {
      dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = dropdownBtn.getAttribute('aria-expanded') === 'true';
        dropdownBtn.setAttribute('aria-expanded', !isExpanded);
        dropdownMenu.classList.toggle('show');
      });

      const dropdownItemsForThisMenu = dropdownMenu.querySelectorAll('.sub-collection-navigation__dropdown-item');
      dropdownItemsForThisMenu.forEach(item => {
        item.addEventListener('click', function() {
          const value = this.getAttribute('data-value');
          const text = this.textContent;
          
          if (dropdownText) {
            dropdownText.textContent = text;
          }
          
          dropdownItemsForThisMenu.forEach(i => i.classList.remove('active'));
          this.classList.add('active');
          dropdownBtn.setAttribute('aria-expanded', 'false');
          dropdownMenu.classList.remove('show');
        });
      });

      document.addEventListener('click', function(e) {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
          dropdownBtn.setAttribute('aria-expanded', 'false');
          dropdownMenu.classList.remove('show');
        }
      });

      dropdownBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dropdownBtn.click();
        }
      });

      dropdownItemsForThisMenu.forEach(item => {
        item.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
          }
        });
      });
    }
  });

  // Touch/swipe support for mobile
  const container = document.getElementById('sub-collection-scroll');
  if (!container) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.style.cursor = 'grabbing';
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });
});