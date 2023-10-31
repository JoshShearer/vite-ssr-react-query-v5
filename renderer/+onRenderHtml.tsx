import ReactDOMServer from "react-dom/server";
import React from "react";
import { PageShell } from "./PageShell";
import { escapeInject } from "vike/server";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import logoUrl from "./logo.svg";

import { renderToStream } from "react-streaming/server"; //streaming

import { PageContext } from "./types";

async function onRenderHtml(pageContext: PageContext) {
  const pageCtx = pageContext;
  const {
    Page,
    pageProps,
  } = pageCtx;

  const stream = await renderToStream(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </PageShell>
  );

  // See https://vike.com/head

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>`;

  return {
    documentHtml,
  };
}

export default onRenderHtml;
