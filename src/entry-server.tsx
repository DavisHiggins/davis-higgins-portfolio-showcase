import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server'
import { routes } from './routes'
import { metaForPath, renderHeadTags, NOT_FOUND_META, PRERENDER_PATHS } from './lib/meta'

export { PRERENDER_PATHS }

export interface RenderResult {
  html: string
  head: string
  status: number
}

/** Renders one route to HTML for the build-time prerenderer (scripts/prerender.mjs). */
export async function render(pathname: string): Promise<RenderResult> {
  const handler = createStaticHandler(routes, { future: { v7_relativeSplatPath: true } })
  const context = await handler.query(new Request(`https://portfolio.davishiggins.com${pathname}`))
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${pathname}`)

  const router = createStaticRouter(handler.dataRoutes, context)
  const html = renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} />
    </StrictMode>,
  )
  const notFound = context.statusCode === 404 || metaForPath(pathname) === NOT_FOUND_META
  const head = renderHeadTags(notFound ? NOT_FOUND_META : metaForPath(pathname), { noindex: notFound })
  return { html, head, status: notFound ? 404 : context.statusCode }
}
