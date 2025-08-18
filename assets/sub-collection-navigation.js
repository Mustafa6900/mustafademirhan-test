/**
 * Sub-Collection Navigation JavaScript
 * Handles scrolling, dropdown functionality, and touch interactions
 */

function scrollSubCollection(direction) {
  const container = document.getElementById('sub-collection-scroll');
  if (!container) {
    return;
  }
  
  // Get all items to calculate exact scroll position
  const items = container.querySelectorAll('.sub-collection-navigation__item');
  if (!items.length) {
    return;
  }
  
  // Get current scroll position
  const currentScroll = container.scrollLeft;
  
  // Get responsive gap value based on screen width
  let gap = 24; // Default gap for desktop
  if (window.innerWidth <= 480) {
    gap = 12; // Mobile gap
  } else if (window.innerWidth <= 749) {
    gap = 16; // Tablet gap
  }
  
  // Calculate item width including gap
  const itemWidth = items[0].offsetWidth + gap;
  
  // Calculate how many items are currently visible
  const containerWidth = container.offsetWidth;
  const visibleItems = Math.floor(containerWidth / itemWidth);
  
  // Calculate target scroll position
  let targetScroll;
  if (direction === 'left') {
    // Scroll left by one item
    targetScroll = Math.max(0, currentScroll - itemWidth);
  } else {
    // Scroll right by one item
    const maxScroll = container.scrollWidth - containerWidth;
    targetScroll = Math.min(maxScroll, currentScroll + itemWidth);
  }
  
  // Smooth scroll to target position
  container.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Add event listeners for navigation arrows
  const prevButtons = document.querySelectorAll('.sub-collection-navigation__control-btn--prev');
  const nextButtons = document.querySelectorAll('.sub-collection-navigation__control-btn--next');
  
  prevButtons.forEach(button => {
    button.addEventListener('click', function() {
      scrollSubCollection('left');
    });
  });
  
  nextButtons.forEach(button => {
    button.addEventListener('click', function() {
      scrollSubCollection('right');
    });
  });
  
  // Alternative approach using data attributes
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
  const dropdownItems = document.querySelectorAll('.sub-collection-navigation__dropdown-item');
  const dropdownTexts = document.querySelectorAll('.sub-collection-navigation__dropdown-text');

  // Handle each dropdown
  dropdownBtns.forEach((dropdownBtn, index) => {
    const dropdownMenu = dropdownMenus[index];
    const dropdownText = dropdownTexts[index];
    
    if (dropdownBtn && dropdownMenu) {
      // Toggle dropdown
      dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = dropdownBtn.getAttribute('aria-expanded') === 'true';
        dropdownBtn.setAttribute('aria-expanded', !isExpanded);
        dropdownMenu.classList.toggle('show');
      });

      // Handle item selection for this specific dropdown
      const dropdownItemsForThisMenu = dropdownMenu.querySelectorAll('.sub-collection-navigation__dropdown-item');
      dropdownItemsForThisMenu.forEach(item => {
        item.addEventListener('click', function() {
          const value = this.getAttribute('data-value');
          const text = this.textContent;
          
          // Update button text
          if (dropdownText) {
            dropdownText.textContent = text;
          }
          
          // Update active state for this dropdown only
          dropdownItemsForThisMenu.forEach(i => i.classList.remove('active'));
          this.classList.add('active');
          
          // Close dropdown
          dropdownBtn.setAttribute('aria-expanded', 'false');
          dropdownMenu.classList.remove('show');
          
          // Here you can add logic to filter content based on selection
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
          dropdownBtn.setAttribute('aria-expanded', 'false');
          dropdownMenu.classList.remove('show');
        }
      });

      // Keyboard navigation
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
