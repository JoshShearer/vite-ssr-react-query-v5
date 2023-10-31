export default onBeforeRender

import type { PageContextServer } from '#root/renderer/types'
import type { DehydratedState } from '@tanstack/react-query'
import { render } from 'vike/abort'
import { getUsers } from '#src/api/users'
import {
    dehydrate,
    QueryClient,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 10,
            staleTime: Infinity,
            retryDelay: 2000,
        },
    },
});

async function onBeforeRender(pageContext: PageContextServer) {

    const prefetchQueries = {
        ['usersAbout']: {
            fn: getUsers
        }
    }

    let dehydratedState: DehydratedState | undefined;
    console.log("🚀 ~ file: +onBeforeRender.tsx:25 ~ onBeforeRender ~ prefetchQueries:", prefetchQueries)
    
    try {
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

        dehydratedState = dehydrate(queryClient);
    } catch (error) {
        console.error(error)
        throw render(503, `Couldn't fetch data, because failed HTTP GET request to ${pageContext.urlPathname}`)
    }

    return {
        pageContext: {
            pageProps: {
                dehydratedState
            },
        }
    }
}
