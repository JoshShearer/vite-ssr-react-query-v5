export const clientRouting = true
export const hydrationCanBeAborted = true

import React from 'react'
import { hydrateRoot, createRoot, Root } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PageShell } from './PageShell'
import { dehydrate, HydrationBoundary, QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { PageContext } from './types'

export { render, onHydrationEnd, onPageTransitionEnd, onPageTransitionStart, onBeforeRender }

let root: Root
let dehydratedState: unknown
const queryClient = useQueryClient()
// new QueryClient({
//   defaultOptions: {
//     queries: {
//       gcTime: 1000 * 60 * 10,
//       staleTime: Infinity,
//       retryDelay: 2000
//     }
//   }
// })

async function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext

  if (!dehydratedState && pageContext.dehydratedState) {
    dehydratedState = pageContext.dehydratedState
  }

  const page = (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <BrowserRouter>
          <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </PageShell>
        </BrowserRouter>
      </HydrationBoundary>
    </QueryClientProvider>
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
  document.title = (pageContext.exports.documentProps || {}).title || (pageContext.documentProps || {}).title || 'Demo'
}

async function onBeforeRender(pageContext: PageContext) {
  //const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  //await delay(1000);
  const { prefetchQueries } = pageContext.exports

  if (prefetchQueries?.constructor == Object) {
    const queries: Promise<void>[] = []

    Object.entries(prefetchQueries).forEach(([key, query]) => {
      queries.push(
        queryClient.prefetchQuery({
          queryKey: [key],
          queryFn: query.fn
        })
      )
    })

    await Promise.all(queries)

    dehydratedState = dehydrate(queryClient)
  }
}

function onHydrationEnd() {
  console.log('Hydration finished; page is now interactive.')
}
function onPageTransitionStart() {
  console.log('Page transition start')
  document.querySelector('body')?.classList.add('page-is-transitioning')
}
function onPageTransitionEnd() {
  console.log('Page transition end')
  document.querySelector('body')?.classList.remove('page-is-transitioning')
}

/* To enable Client-side Routing:
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
