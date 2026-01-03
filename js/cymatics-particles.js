document.addEventListener('DOMContentLoaded', function() {
  // Cymatics Particle System using Three.js
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
      this.patternParams = this.generateRandomPattern();

      this.init();
      this.createParticles();
      this.animate();

      // Mouse interaction
      document.addEventListener('mousemove', (event) => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      });

      // Touch interaction for mobile
      document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
          const touch = event.touches[0];
          this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
          this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        }
      });

      // Handle window resize
      window.addEventListener('resize', () => {
        this.onWindowResize();
      });
    }

    init() {
      console.log('Initializing Three.js scene...');

      // Scene setup
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000); // Pure black background
      console.log('Scene created');

      // Camera setup - zoomed in as requested
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.z = 50; // Closer zoom for bigger patterns
      console.log('Camera created');

      // Renderer setup
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(0x000000, 1);
      console.log('Renderer created');

      // Add renderer to container
      const container = document.getElementById('particle-container');
      console.log('Container element:', container);

      if (container) {
        container.appendChild(this.renderer.domElement);
        console.log('Renderer canvas added to container');

        // Hide fallback message once particles are initialized
        const fallback = container.querySelector('.particle-fallback');
        if (fallback) {
          fallback.style.display = 'none';
        }
      } else {
        console.error('Particle container not found!');
      }
    }

    generateRandomPattern() {
      // Generate random cymatics parameters for variety on reload
      return {
        frequency1: 2 + Math.random() * 4,    // Primary wave frequency
        frequency2: 3 + Math.random() * 6,    // Secondary wave frequency
        amplitude1: 0.8 + Math.random() * 1.2, // Primary amplitude
        amplitude2: 0.6 + Math.random() * 1.0, // Secondary amplitude
        phaseOffset: Math.random() * Math.PI * 2, // Phase difference
        rotationSpeed: (Math.random() - 0.5) * 0.01, // Slow rotation
        colorHue: Math.random() * 360 // Color variation
      };
    }

    createParticles() {
      // Adaptive particle count based on device performance
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 8000 : 15000; // Reduce particles on mobile
      this.geometry = new THREE.BufferGeometry();

      // Create grid of particles
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      const gridSize = isMobile ? 90 : 120; // Smaller grid on mobile
      const spacing = isMobile ? 2 : 1.5; // Larger spacing on mobile

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Position particles in a grid
        const x = (i % gridSize - gridSize / 2) * spacing;
        const y = (Math.floor(i / gridSize) - gridSize / 2) * spacing;
        const z = 0;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        // Vary particle sizes
        sizes[i] = 1 + Math.random() * 2;
      }

      this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Shader material for custom particle rendering
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mouse: { value: new THREE.Vector2(0, 0) },
          frequency1: { value: this.patternParams.frequency1 },
          frequency2: { value: this.patternParams.frequency2 },
          amplitude1: { value: this.patternParams.amplitude1 },
          amplitude2: { value: this.patternParams.amplitude2 },
          phaseOffset: { value: this.patternParams.phaseOffset },
          rotationSpeed: { value: this.patternParams.rotationSpeed }
        },
        transparent: true,
        blending: THREE.AdditiveBlending
        vertexShader: `
          attribute float size;

          varying float vDistance;

          uniform float time;
          uniform vec2 mouse;
          uniform float frequency1;
          uniform float frequency2;
          uniform float amplitude1;
          uniform float amplitude2;
          uniform float phaseOffset;
          uniform float rotationSpeed;

          void main() {
            // Calculate cymatics wave displacement
            vec3 pos = position;

            // Distance from center for radial patterns
            float dist = length(pos.xy);

            // Cymatics pattern: interference of two waves
            float wave1 = sin(dist * frequency1 + time * 2.0) * amplitude1;
            float wave2 = sin(dist * frequency2 + time * 2.5 + phaseOffset) * amplitude2;
            float combinedWave = wave1 + wave2;

            // Mouse interaction - particles respond to cursor
            float mouseDist = length(pos.xy - mouse * 80.0);
            float mouseInfluence = 1.0 / (1.0 + mouseDist * 0.02);
            combinedWave += mouseInfluence * sin(time * 3.0) * 0.3;

            // Apply displacement along Z axis
            pos.z = combinedWave * 5.0;

            // Add subtle rotation
            float angle = atan(pos.y, pos.x) + time * rotationSpeed;
            float radius = length(pos.xy);
            pos.x = cos(angle) * radius;
            pos.y = sin(angle) * radius;

            // Calculate distance for size attenuation
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vDistance = -mvPosition.z;

            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (300.0 / -mvPosition.z);
          }
        `,
        fragmentShader: `
          varying float vDistance;

          void main() {
            // Create circular particles with soft edges
            float r = length(gl_PointCoord - vec2(0.5));
            float alpha = 1.0 - smoothstep(0.3, 0.5, r);

            // Distance-based brightness
            float brightness = 1.0 - vDistance * 0.001;
            brightness = clamp(brightness, 0.3, 1.0);

            gl_FragColor = vec4(vec3(brightness), alpha * 0.8);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
      });

      this.particles = new THREE.Points(this.geometry, this.material);
      this.scene.add(this.particles);
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      this.time += 0.01;

      // Update shader uniforms
      this.material.uniforms.time.value = this.time;
      this.material.uniforms.mouse.value.copy(this.mouse);

      // Gentle camera movement for dynamic feel (reduced on mobile for performance)
      const isMobile = window.innerWidth < 768;
      const cameraMovement = isMobile ? 1 : 2;

      this.camera.position.x = Math.sin(this.time * 0.1) * cameraMovement;
      this.camera.position.y = Math.cos(this.time * 0.1) * cameraMovement;
      this.camera.lookAt(0, 0, 0);

      this.renderer.render(this.scene, this.camera);
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
