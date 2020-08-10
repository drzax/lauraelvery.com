/**
 * The design requires that some space be set aside to accomodate the hero image
 * but the height of the hero image is unknown and can't be calculated in CSS.
 */
const hero = document.querySelector("#hero-image");

function adjustLayout() {
  document
    .querySelector("body")
    .style.setProperty("--hero-image-height", hero.clientHeight / 2 + "px");
  Array.from(document.querySelectorAll("#page-content > div")).forEach(
    function (el) {
      el.style.setProperty("margin-right", 0);
    }
  );
}
if (hero) {
  // TODO: this potentially needs to accomodate different hero image positioning and window resize
  hero.querySelector("img").addEventListener("load", adjustLayout);
  window.addEventListener("resize", function () {
    window.requestAnimationFrame(adjustLayout);
  });
}
