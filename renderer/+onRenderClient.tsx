import React from 'react'
import { hydrateRoot, createRoot, Root } from 'react-dom/client'
import { PageShell } from './PageShell'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { PageContext } from './types'

let root: Root

async function onRenderClient(pageContext: PageContext) {

  console.log("🚀 ~ file: +onRenderClient.tsx:28 ~ onRenderClient ~ pageContext:", JSON.stringify(pageContext))
  const { Page, pageProps } = pageContext
  console.log("🚀 ~ file: +onRenderClient.tsx:27 ~ onRenderClient ~ pageProps:", pageProps)
  const preloadedState = pageContext.PRELOADED_STATE;
  console.log("🚀 ~ file: +onRenderClient.tsx:38 ~ onRenderClient ~ preloadedState:", preloadedState ? "redux state found" : "no redux state")

  const page = (
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </PageShell>
  )
  const container = document.getElementById('page-view')

  if (container && pageContext.isHydration) {
    root = hydrateRoot(container, page)
  } else {
    if (!root) {
      root = createRoot(container!)
    }
    root.render(page)
  }

}


export default onRenderClient