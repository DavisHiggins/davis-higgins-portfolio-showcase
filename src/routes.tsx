import type { RouteObject } from 'react-router-dom'
import { RootLayout } from './app/RootLayout'
import { NotFound } from './pages/NotFound'

// Every page is its own chunk; detail routes load their case study or note body
// in a loader so prerendering and client navigation share one data path.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, lazy: () => import('./pages/Home') },
      { path: 'experience', lazy: () => import('./pages/Experience') },
      { path: 'projects', lazy: () => import('./pages/ProjectsIndex') },
      { path: 'projects/:slug', lazy: () => import('./pages/ProjectDetail'), errorElement: <NotFound /> },
      { path: 'education', lazy: () => import('./pages/Education') },
      { path: 'writing', lazy: () => import('./pages/WritingIndex') },
      { path: 'writing/:slug', lazy: () => import('./pages/NoteReader'), errorElement: <NotFound /> },
      { path: 'contact', lazy: () => import('./pages/Contact') },
      { path: '*', element: <NotFound /> },
    ],
  },
]
