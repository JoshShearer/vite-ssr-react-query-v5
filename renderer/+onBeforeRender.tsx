export default onBeforeRender

import type { PageContextServer } from '#root/renderer/types'


async function onBeforeRender(pageContext: PageContextServer) {

console.log("🚀 ~ file: +onBeforeRender.tsx:8 ~ onBeforeRender/renderer ~ pageContext:", pageContext)


    return {
        pageContext: {
            pageProps: {
                PRELOADED_STATE: {
                    test: 'test'
                }
            },
        }
    }
}
