document.addEventListener('DOMContentLoaded', function() {
  const parallaxImg = document.querySelector('.parallax-img');
  const parallaxContainer = document.querySelector('.parallax-container');

  console.log('Script loaded.'); // Log 1: Script loaded

  if (parallaxImg && parallaxContainer) {
    console.log('Parallax elements found:', { parallaxImg, parallaxContainer }); // Log 2: Elements found

    const parallaxSpeed = 1.6; // Adjust this value (0.1 to 0.8 works well for a subtle to moderate effect)

    function parallaxEffect() {
      const scrollPos = window.pageYOffset;
      const containerTop = parallaxContainer.offsetTop; // Absolute position of the container from the top of the document
      const containerHeight = parallaxContainer.offsetHeight;
      const imgHeight = parallaxImg.offsetHeight;

      console.log('Scroll event fired:', { scrollPos, containerTop, containerHeight, imgHeight }); // Log 3: Scroll data

      // Calculate how much the image should move based on scroll
      // We want it to move faster upwards as we scroll down.
      // 'scrollPos - containerTop' gives us how far we've scrolled past the top of the container.
      let translateY = -(scrollPos - containerTop) * parallaxSpeed;

      // Calculate the maximum possible upward movement for the image
      const maxMoveUp = imgHeight - containerHeight;

      // Clamp the translateY value to keep the image within reasonable bounds
      // It should not move so far up that the top of the image shows empty space,
      // and not so far down that the bottom shows empty space.
      translateY = Math.max(Math.min(translateY, 0), -maxMoveUp);

      console.log('Calculated translateY:', translateY); // Log 4: Calculated translation

      parallaxImg.style.transform = `translateY(${translateY}px)`;
    }

    window.addEventListener('scroll', parallaxEffect);
    window.addEventListener('resize', parallaxEffect); // Adjust on resize
    parallaxEffect(); // Initial call
  } else {
    console.warn('Parallax elements not found. Check .parallax-img and .parallax-container classes.'); // Log 5: Elements not found
  }
});
