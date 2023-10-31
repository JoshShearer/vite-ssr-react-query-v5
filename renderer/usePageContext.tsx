// `usePageContext` allows us to access `pageContext` in any React component.
// See https://vike.com/pageContext-anywhere

import React, { ReactNode, useContext } from "react";
import { PageContext } from "./types";

export { PageContextProvider };
export { usePageContext };

const Context = React.createContext<PageContext>(undefined as unknown as PageContext)

function PageContextProvider({
  pageContext,
  children,
}: {
  pageContext: PageContext;
  children: ReactNode;
}) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>;
}

function usePageContext() {
  const pageContext = useContext(Context);
  return pageContext;
}
