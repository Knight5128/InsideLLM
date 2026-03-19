import { extent, scaleLinear } from 'd3'

import type { ProjectionPoint } from '@insidellm/shared'

export function normalizeProjection(points: ProjectionPoint[]) {
  const xExtent = extent(points, (point) => point.x) as [number, number]
  const yExtent = extent(points, (point) => point.y) as [number, number]

  const scaleX = scaleLinear().domain(xExtent).range([10, 90])
  const scaleY = scaleLinear().domain(yExtent).range([85, 15])

  return points.map((point) => ({
    ...point,
    cx: scaleX(point.x),
    cy: scaleY(point.y),
  }))
}
