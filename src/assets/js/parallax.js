document.addEventListener('DOMContentLoaded', function () {
  var parallaxContainer = document.querySelector('.parallax-container');

  function parallaxEffect() {
    var scrollPosition = window.scrollY;
    var layers = parallaxContainer.querySelectorAll('.parallax-layer');

    layers.forEach(function (layer, index) {
      var speed = 0.5 * (index + 1);
      var movement = -(scrollPosition * speed);
      layer.style.transform = 'translateY(' + movement + 'px)';
    });
  }

  window.addEventListener('scroll', parallaxEffect);
});
