document.addEventListener('DOMContentLoaded', function() {
  const parallaxImg = document.querySelector('.parallax-img');
  const parallaxContainer = document.querySelector('.parallax-container');

  if (parallaxImg && parallaxContainer) {
    const parallaxSpeed = 1.6; // Adjust this value for parallax effect strength

    function parallaxEffect() {
      const scrollPos = window.pageYOffset;
      const containerTop = parallaxContainer.offsetTop;
      const containerHeight = parallaxContainer.offsetHeight;
      const imgHeight = parallaxImg.offsetHeight;

      // Calculate how much the image should move based on scroll
      let translateY = -(scrollPos - containerTop) * parallaxSpeed;

      // Clamp the translateY value to keep the image within reasonable bounds
      const maxMoveUp = imgHeight - containerHeight;
      translateY = Math.max(Math.min(translateY, 0), -maxMoveUp);

      parallaxImg.style.transform = `translateY(${translateY}px)`;
    }

    window.addEventListener('scroll', parallaxEffect);
    window.addEventListener('resize', parallaxEffect);
    parallaxEffect(); // Initial call
  }
});
