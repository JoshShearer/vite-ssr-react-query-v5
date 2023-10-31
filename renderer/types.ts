export type { PageContextServer }
export type { PageContextClient }
export type { PageContext }
export type { PageProps }

import React from 'react'
import type {
  PageContextBuiltInServer as PageContextBuiltIn,

  // When using Client Routing https://vike.com/clientRouting
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient

  // When using Server Routing
  // PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient,
  //*/
} from 'vike/types'

import type { QueryOptions, DehydratedState, QueryFunction } from '@tanstack/react-query'
import PropTypes from 'prop-types'

type Page = (pageProps: PageProps) => React.ReactElement
type PageProps = typeof PropTypes.any

type PageContextCustom = {
  Page: Page
  pageProps?: {
    prefetchQueries?: QueryPrefetch
    dehydratedState?: DehydratedState
  }
  isHydration: boolean
}

type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom

type PageContext = PageContextClient | PageContextServer
type QueryPrefetch = [string, { fn: QueryFunction; options?: QueryOptions }]
