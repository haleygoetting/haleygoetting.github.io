/**
 * Gallery Lightbox - Image viewer with navigation
 * Allows users to click on gallery images to view them enlarged
 * with left/right navigation arrows
 */

class GalleryLightbox {
  constructor() {
    this.currentIndex = 0;
    this.images = [];
    this.lightbox = null;
    this.init();
  }

  init() {
    // Create lightbox HTML structure
    this.createLightbox();
    
    // Find all gallery items and make them clickable
    this.setupGalleryItems();
    
    // Setup event listeners
    this.setupEventListeners();
  }

  createLightbox() {
    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-prev" aria-label="Previous image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="lightbox-image-container">
          <img src="" alt="" class="lightbox-image">
        </div>
        <button class="lightbox-next" aria-label="Next image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        <div class="lightbox-counter"></div>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    this.lightbox = lightbox;
  }

  setupGalleryItems() {
    // Find all gallery images
    const galleryItems = document.querySelectorAll('.gallery-item img, .gallery img');
    
    this.images = Array.from(galleryItems).map((img, index) => {
      // Make image clickable
      img.style.cursor = 'pointer';
      img.dataset.galleryIndex = index;
      
      // Add click event
      img.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLightbox(index);
      });
      
      return {
        src: img.src,
        alt: img.alt || 'Gallery image'
      };
    });
  }

  setupEventListeners() {
    // Close button
    const closeBtn = this.lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', () => this.closeLightbox());
    
    // Overlay click to close
    const overlay = this.lightbox.querySelector('.lightbox-overlay');
    overlay.addEventListener('click', () => this.closeLightbox());
    
    // Previous button
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    prevBtn.addEventListener('click', () => this.showPrevious());
    
    // Next button
    const nextBtn = this.lightbox.querySelector('.lightbox-next');
    nextBtn.addEventListener('click', () => this.showNext());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      
      switch(e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.showPrevious();
          break;
        case 'ArrowRight':
          this.showNext();
          break;
      }
    });
    
    // Prevent scrolling when lightbox is open
    this.lightbox.addEventListener('wheel', (e) => {
      if (this.lightbox.classList.contains('active')) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  openLightbox(index) {
    this.currentIndex = index;
    this.updateImage();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  showPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  }

  updateImage() {
    const image = this.images[this.currentIndex];
    const imgElement = this.lightbox.querySelector('.lightbox-image');
    const counter = this.lightbox.querySelector('.lightbox-counter');
    
    // Update image
    imgElement.src = image.src;
    imgElement.alt = image.alt;
    
    // Update counter
    counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    
    // Show/hide navigation buttons
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');
    
    if (this.images.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GalleryLightbox();
  });
} else {
  new GalleryLightbox();
}
