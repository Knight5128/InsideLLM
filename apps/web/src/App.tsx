import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { SiteLayout } from '@/components/layout/SiteLayout'

const HomePage = lazy(() => import('@/pages/Home').then((module) => ({ default: module.HomePage })))
const ArchitecturePage = lazy(() =>
  import('@/pages/Architecture').then((module) => ({ default: module.ArchitecturePage })),
)
const TokenLabPage = lazy(() =>
  import('@/pages/TokenLab').then((module) => ({ default: module.TokenLabPage })),
)
const EmbeddingLabPage = lazy(() =>
  import('@/pages/EmbeddingLab').then((module) => ({ default: module.EmbeddingLabPage })),
)
const TimelinePage = lazy(() =>
  import('@/pages/Timeline').then((module) => ({ default: module.TimelinePage })),
)

function PageFallback() {
  return (
    <div className="rounded-3xl border border-cyan-100 bg-white/80 p-8 text-sm text-slate-600">
      正在加载可视化场景...
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />} path="/">
        <Route
          element={
            <Suspense fallback={<PageFallback />}>
              <HomePage />
            </Suspense>
          }
          index
        />
        <Route
          element={
            <Suspense fallback={<PageFallback />}>
              <ArchitecturePage />
            </Suspense>
          }
          path="architecture"
        />
        <Route
          element={
            <Suspense fallback={<PageFallback />}>
              <TokenLabPage />
            </Suspense>
          }
          path="token-lab"
        />
        <Route
          element={
            <Suspense fallback={<PageFallback />}>
              <EmbeddingLabPage />
            </Suspense>
          }
          path="embedding-lab"
        />
        <Route
          element={
            <Suspense fallback={<PageFallback />}>
              <TimelinePage />
            </Suspense>
          }
          path="timeline"
        />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Route>
    </Routes>
  )
}

export default App
