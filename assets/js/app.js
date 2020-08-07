/**
 * The design requires that some space be set aside to accomodate the hero image
 * but the height of the hero image is unknown and can't be calculated in CSS.
 */
const hero = document.querySelector("#hero-image");
if (hero) {
  // TODO: this potentially needs to accomodate different hero image positioning and window resize
  const img = hero.querySelector("img").addEventListener("load", function () {
    document
      .querySelector("body")
      .style.setProperty("--hero-image-height", hero.clientHeight / 2 + "px");
    document
      .querySelector("#page-content > div")
      .style.setProperty("margin-right", 0);
  });
}
