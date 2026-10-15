import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter, matchRoutes } from 'react-router-dom'
import { routes } from './routes'
import './index.css'

type HydrationState = NonNullable<NonNullable<Parameters<typeof createBrowserRouter>[1]>['hydrationData']>

declare global {
  interface Window {
    __staticRouterHydrationData?: HydrationState
  }
}

async function start() {
  const container = document.getElementById('root')
  if (!container) return
  const prerenderedPath = container.dataset.prerenderPath
  const prerenderedSearch = container.dataset.prerenderSearch ?? ''
  const samePath = prerenderedPath === window.location.pathname
  const sameUrl = samePath && prerenderedSearch === window.location.search

  // Load the matched lazy route modules first so hydration renders the same tree
  // as the prerendered HTML instead of a loading fallback.
  const matches = matchRoutes(routes, window.location)?.filter((m) => m.route.lazy)
  if (matches?.length) {
    await Promise.all(
      matches.map(async (m) => {
        const routeModule = await m.route.lazy!()
        Object.assign(m.route, { ...routeModule, lazy: undefined })
      }),
    )
  }

  const router = createBrowserRouter(routes, {
    hydrationData: samePath ? window.__staticRouterHydrationData : undefined,
    future: { v7_relativeSplatPath: true },
  })
  const app = (
    <StrictMode>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </StrictMode>
  )

  // Hydrate only when the HTML was rendered for exactly this URL. A different
  // query string (a filtered gallery) or the generic 404 page renders fresh.
  if (sameUrl && container.hasChildNodes()) hydrateRoot(container, app)
  else createRoot(container).render(app)
}

void start()
