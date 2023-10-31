export default onHydrationEnd

function onHydrationEnd() {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("Hydration finished; page is now interactive.");
  }
}
