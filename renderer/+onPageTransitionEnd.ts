export default onPageTransitionEnd

function onPageTransitionEnd() {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info("Page transition end");
  }
  document.querySelector("body")?.classList.remove("page-is-transitioning");
}
