export default onPageTransitionStart

function onPageTransitionStart() {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info("Page transition start");
  }
  document.querySelector("body")?.classList.add("page-is-transitioning");
}
