import React, { ReactNode } from "react";
import logo from "./logo.svg";
import "./PageShell.css";
import { PageContextProvider } from "./usePageContext";
import { HydrationBoundary, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { navigate } from "vike/client/router"

import { PageContext } from "./types";

export { PageShell };

function PageShell({
  pageContext,
  children,
}: {
  pageContext: PageContext;
  children: ReactNode;
}) {
  const { pageProps } = pageContext

  const [queryClient] = React.useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: 1000 * 60 * 10,
          staleTime: Infinity,
          retryDelay: 2000
        }
      }
    }))

  const RQWrapper = pageProps && pageProps.dehydratedState ?
    () =>
      <HydrationBoundary state={pageProps.dehydratedState}>{children}</HydrationBoundary>
    : () => <>{children}</>

  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>
          <Sidebar>
            <Logo />
            <a className="navitem" href={"/"}>
              Home
            </a>
            <a className="navitem" href={"/about"}>
              About
            </a>
          </Sidebar>
          <Content>
            <QueryClientProvider client={queryClient}>
              <RQWrapper>
                {children}
              </RQWrapper>
            </QueryClientProvider>
          </Content>
        </Layout>
      </PageContextProvider>
    </React.StrictMode>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        maxWidth: 900,
        margin: "auto",
      }}
    >
      {children}
    </div>
  );
}

function Sidebar({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: "1.8em",
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        paddingBottom: 50,
        borderLeft: "2px solid #eee",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}

const Logo = () => {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      <a href="/">
        <img src={logo} height={64} width={64} alt="logo" />
      </a>
    </div>
  );
};
