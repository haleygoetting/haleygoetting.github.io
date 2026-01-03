console.log('Cymatics particles script loaded!');

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, starting particle system...');

  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.error('Three.js not loaded!');
    showError('Three.js failed to load. Please check your internet connection.');
    return;
  }

  console.log('Three.js is available, creating particles...');

  // Simple Cymatics Particle System
  class CymaticsParticles {
    constructor() {
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.particles = null;
      this.geometry = null;
      this.material = null;
      this.mouse = new THREE.Vector2(0, 0);
      this.time = 0;

      try {
        this.init();
        console.log('Particle system initialized');
      } catch (error) {
        console.error('Error initializing particle system:', error);
        showError('Failed to initialize particle system');
        return;
      }
    }

    init() {
      console.log('Initializing simple particle system...');

      // Scene setup
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);

      // Camera setup
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 100;

      // Renderer setup
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      // Add renderer to container
      const container = document.getElementById('particle-container');
      if (container) {
        container.appendChild(this.renderer.domElement);
        console.log('Renderer added to container');

        // Hide fallback message
        const fallback = container.querySelector('.particle-fallback');
        if (fallback) {
          fallback.innerHTML = 'Particles loaded successfully!';
          setTimeout(() => fallback.style.display = 'none', 2000);
        }

        this.createSimpleParticles();
        this.startAnimation();
        console.log('Particle system started');
      } else {
        console.error('Container not found!');
        showError('Particle container not found');
      }
    }


    createSimpleParticles() {
      console.log('Creating simple particles...');

      const particleCount = 3000;
      const positions = new Float32Array(particleCount * 3);

      // Create simple grid of particles
      const gridSize = 60;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = (i % gridSize - gridSize / 2) * 3;
        const y = (Math.floor(i / gridSize) - gridSize / 2) * 3;
        const z = (Math.random() - 0.5) * 20; // Some depth variation

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
      }

      this.geometry = new THREE.BufferGeometry();
      this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Simple white material
      this.material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 3,
        transparent: true,
        opacity: 0.8
      });

      this.particles = new THREE.Points(this.geometry, this.material);
      this.scene.add(this.particles);

      console.log('Simple particles created:', particleCount);
    }


    startAnimation() {
      const animate = () => {
        requestAnimationFrame(animate);

        // Simple rotation for some movement
        if (this.particles) {
          this.particles.rotation.y += 0.002;
          this.particles.rotation.x += 0.001;
        }

        this.renderer.render(this.scene, this.camera);
      };

      animate();
      console.log('Animation started');
    }


    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // Add some debugging
  console.log('Initializing cymatics particles...');

  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.error('Three.js not loaded!');
    showFallbackError('Three.js failed to load. Please check your internet connection.');
    return;
  }

  try {
    // Initialize the particle system
    new CymaticsParticles();
  } catch (error) {
    console.error('Failed to initialize particle system:', error);
    showFallbackError('Particle system failed to initialize. Try refreshing the page.');
  }

  function showFallbackError(message) {
    const container = document.getElementById('particle-container');
    if (container) {
      const fallback = container.querySelector('.particle-fallback');
      if (fallback) {
        fallback.innerHTML = message;
        fallback.style.color = 'rgba(255, 100, 100, 0.6)';
      }
    }
  }
});
