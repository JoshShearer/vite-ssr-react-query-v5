import ReactDOMServer from "react-dom/server";
import React from "react";
import { StaticRouter } from "react-router-dom/server";
import { PageShell } from "./PageShell";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import logoUrl from "./logo.svg";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { renderToStream } from "react-streaming/server"; //streaming

import { PageContext } from "./types";

export { render };

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = [
  "pageProps",
  "documentProps",
  "urlPathname",
  "someAsyncProps",
  "dehydratedState",
];

async function render(pageContext: PageContext) {
  const pageCtx = pageContext;
  const {
    Page,
    pageProps,
    exports: { prefetchQueries },
    urlPathname,
  } = pageCtx;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 10,
        staleTime: Infinity,
        retryDelay: 2000,
      },
    },
  });

  if (prefetchQueries?.constructor == Object) {
    const queries: Promise<void>[] = [];

    Object.entries(prefetchQueries).forEach(([key, query]) => {
      queries.push(
        queryClient.prefetchQuery({
          queryKey: [key],
          queryFn: query.fn
        })
      )
    })

    await Promise.all(queries);
  }

  const dehydratedState = dehydrate(queryClient);
  pageCtx.dehydratedState = dehydratedState;

  const stream = await renderToStream(
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <StaticRouter location={urlPathname}>
          <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
          </PageShell>
        </StaticRouter>
      </HydrationBoundary>
    </QueryClientProvider>
  );

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports;
  const title = (documentProps && documentProps.title) || "Vite SSR app";
  const desc =
    (documentProps && documentProps.description) ||
    "App using Vite + vite-plugin-ssr";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
