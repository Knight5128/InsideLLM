import { Html, Line, OrbitControls, RoundedBox, Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type ComponentRef } from 'react'
import * as THREE from 'three'

import {
  GPT_EXHIBITION_MODELS,
  type ExhibitionModel,
  type ExhibitionModelId,
  type ExhibitionSectionId,
} from '@/components/3d/gptExhibitionData'

interface GptArchitectureExhibitionSceneProps {
  detailMode: 'basic' | 'advanced'
  selectedModelId: ExhibitionModelId
  selectedSectionId: ExhibitionSectionId
  onSelect: (modelId: ExhibitionModelId, sectionId: ExhibitionSectionId) => void
}

type ModuleTone = 'input' | 'weight' | 'activation' | 'aggregation' | 'residual' | 'shell'
type ModuleGlyphKind =
  | 'tokens'
  | 'embedding-source'
  | 'embedding-result'
  | 'stack'
  | 'transformer-block'
  | 'norm'
  | 'attention'
  | 'attention-qkv'
  | 'attention-matrix'
  | 'projection'
  | 'residual'
  | 'mlp'
  | 'mlp-up'
  | 'mlp-activation'
  | 'mlp-down'
  | 'lm-head'
  | 'softmax'

interface SceneModule {
  id: string
  label: string
  modelId: ExhibitionModelId
  position: [number, number, number]
  size: [number, number, number]
  tone: ModuleTone
  glyphKind: ModuleGlyphKind
  primarySection: ExhibitionSectionId
  sectionIds: ExhibitionSectionId[]
  isMacro?: boolean
}

interface SceneModel {
  id: ExhibitionModelId
  originX: number
  model: ExhibitionModel
  modules: SceneModule[]
}

interface FocusPose {
  position: THREE.Vector3
  target: THREE.Vector3
}

const MODEL_SPACING = 34
const MODULE_PANEL_DEPTH = 0.28

function shiftColor(baseHex: string, lightness: number, saturation = 0) {
  const color = new THREE.Color(baseHex)
  color.offsetHSL(0, saturation, lightness)
  return `#${color.getHexString()}`
}

function createCirclePoints(radius: number, z: number, segments = 32) {
  const points: [number, number, number][] = []
  for (let index = 0; index <= segments; index += 1) {
    const theta = (index / segments) * Math.PI * 2
    points.push([Math.cos(theta) * radius, Math.sin(theta) * radius, z])
  }
  return points
}

function RectFrame({
  width,
  height,
  z,
  color,
  opacity = 0.4,
}: {
  width: number
  height: number
  z: number
  color: string
  opacity?: number
}) {
  const hw = width / 2
  const hh = height / 2

  return (
    <Line
      color={color}
      lineWidth={0.8}
      opacity={opacity}
      points={[
        [-hw, -hh, z],
        [hw, -hh, z],
        [hw, hh, z],
        [-hw, hh, z],
        [-hw, -hh, z],
      ]}
      transparent
    />
  )
}

function ArrowStroke({
  start,
  end,
  color,
  z,
  opacity = 0.75,
  bend = 0,
}: {
  start: [number, number]
  end: [number, number]
  color: string
  z: number
  opacity?: number
  bend?: number
}) {
  const startVector = new THREE.Vector2(start[0], start[1])
  const endVector = new THREE.Vector2(end[0], end[1])
  const delta = endVector.clone().sub(startVector)
  const unit = delta.lengthSq() > 0 ? delta.normalize() : new THREE.Vector2(1, 0)
  const headLength = Math.min(0.22, endVector.distanceTo(startVector) * 0.24)
  const left = unit.clone().rotateAround(new THREE.Vector2(0, 0), Math.PI * 0.8).multiplyScalar(headLength)
  const right = unit.clone().rotateAround(new THREE.Vector2(0, 0), -Math.PI * 0.8).multiplyScalar(headLength)
  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2 + bend,
    z,
  ]

  return (
    <group>
      <Line
        color={color}
        lineWidth={1}
        opacity={opacity}
        points={[
          [start[0], start[1], z],
          midpoint,
          [end[0], end[1], z],
        ]}
        transparent
      />
      <Line
        color={color}
        lineWidth={1}
        opacity={opacity}
        points={[
          [end[0], end[1], z],
          [end[0] - left.x, end[1] - left.y, z],
        ]}
        transparent
      />
      <Line
        color={color}
        lineWidth={1}
        opacity={opacity}
        points={[
          [end[0], end[1], z],
          [end[0] - right.x, end[1] - right.y, z],
        ]}
        transparent
      />
    </group>
  )
}

function MatrixCells({
  position = [0, 0, 0],
  rows,
  cols,
  width,
  height,
  color,
  emphasis,
  opacity = 0.78,
}: {
  position?: [number, number, number]
  rows: number
  cols: number
  width: number
  height: number
  color: string
  emphasis?: (row: number, col: number) => number
  opacity?: number
}) {
  const gapX = Math.min(0.08, width / Math.max(cols * 5, 8))
  const gapY = Math.min(0.08, height / Math.max(rows * 5, 8))
  const cellWidth = (width - gapX * (cols - 1)) / cols
  const cellHeight = (height - gapY * (rows - 1)) / rows
  const base = shiftColor(color, 0.18, -0.05)
  const highlight = shiftColor(color, 0.3, 0.04)

  return (
    <group position={position}>
      {Array.from({ length: rows * cols }, (_, index) => {
        const row = Math.floor(index / cols)
        const col = index % cols
        const weight = THREE.MathUtils.clamp(emphasis?.(row, col) ?? 0.45, 0, 1)
        if (weight <= 0.02) {
          return null
        }

        const x = -width / 2 + cellWidth / 2 + col * (cellWidth + gapX)
        const y = height / 2 - cellHeight / 2 - row * (cellHeight + gapY)
        const cellOpacity = opacity * (0.28 + weight * 0.72)
        const cellColor = weight > 0.72 ? highlight : base

        return (
          <mesh key={`${row}-${col}`} position={[x, y, 0]}>
            <planeGeometry args={[cellWidth, cellHeight]} />
            <meshBasicMaterial color={cellColor} opacity={cellOpacity} transparent />
          </mesh>
        )
      })}
    </group>
  )
}

function DistributionBars({
  count,
  width,
  height,
  color,
  z,
  pattern,
  opacity = 0.78,
}: {
  count: number
  width: number
  height: number
  color: string
  z: number
  pattern: number[]
  opacity?: number
}) {
  const gap = Math.min(0.09, width / Math.max(count * 4.5, 8))
  const barWidth = (width - gap * (count - 1)) / count

  return (
    <group>
      {Array.from({ length: count }, (_, index) => {
        const value = pattern[index] ?? pattern[pattern.length - 1] ?? 0.3
        const barHeight = Math.max(height * value, height * 0.12)
        const x = -width / 2 + barWidth / 2 + index * (barWidth + gap)
        const y = -height / 2 + barHeight / 2
        const barColor = index === count - 2 ? shiftColor(color, 0.34, 0.08) : shiftColor(color, 0.18)

        return (
          <mesh key={`bar-${index}`} position={[x, y, z]}>
            <planeGeometry args={[barWidth, barHeight]} />
            <meshBasicMaterial color={barColor} opacity={opacity} transparent />
          </mesh>
        )
      })}
    </group>
  )
}

function ModuleVectorGlyph({
  module,
  accent,
  activeModel,
  selected,
}: {
  module: SceneModule
  accent: string
  activeModel: boolean
  selected: boolean
}) {
  const width = Math.max(module.size[0] - 0.34, 0.8)
  const height = Math.max(module.size[1] - 0.3, 0.5)
  const z = MODULE_PANEL_DEPTH / 2 + 0.02
  const lineColor = selected ? accent : shiftColor(accent, 0.06, 0.02)
  const softColor = shiftColor(accent, 0.24, -0.08)
  const faintOpacity = activeModel ? 0.42 : 0.18
  const strongOpacity = activeModel ? (selected ? 0.94 : 0.72) : 0.28

  switch (module.glyphKind) {
    case 'tokens':
      return (
        <group position={[0, 0.04, 0]}>
          {[-0.9, -0.3, 0.3, 0.9].map((x, index) => (
            <group key={`token-${index}`} position={[x * (width / 2.5), 0, z]}>
              <mesh>
                <planeGeometry args={[width * 0.18, height * 0.5]} />
                <meshBasicMaterial color={index === 1 ? lineColor : softColor} opacity={strongOpacity} transparent />
              </mesh>
              <Text anchorX="center" anchorY="middle" color="#0f172a" fontSize={0.18} position={[0, 0, 0.02]}>
                {index === 3 ? '...' : `T${index + 1}`}
              </Text>
            </group>
          ))}
          <ArrowStroke color={lineColor} end={[0, -height * 0.48]} start={[0, -0.08]} z={z + 0.01} />
        </group>
      )

    case 'embedding-source':
      return (
        <group position={[0, 0.04, 0]}>
          <MatrixCells
            color={accent}
            cols={4}
            emphasis={(_, col) => (col === 1 ? 1 : 0.35)}
            height={height * 0.86}
            position={[-width * 0.14, 0, z]}
            rows={6}
            width={width * 0.5}
          />
          <RectFrame color={lineColor} height={height * 0.86} opacity={faintOpacity} width={width * 0.5} z={z + 0.005} />
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.95}
            height={height * 0.66}
            position={[width * 0.29, 0, z]}
            rows={6}
            width={width * 0.12}
          />
          <ArrowStroke color={lineColor} end={[width * 0.18, 0]} start={[width * 0.01, 0]} z={z + 0.01} />
        </group>
      )

    case 'embedding-result':
      return (
        <group position={[0, 0.04, 0]}>
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.86}
            height={height * 0.58}
            position={[-width * 0.24, 0.06, z]}
            rows={5}
            width={width * 0.11}
          />
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={(row) => (row % 2 === 0 ? 0.98 : 0.58)}
            height={height * 0.58}
            position={[0, 0.06, z]}
            rows={5}
            width={width * 0.11}
          />
          <Text anchorX="center" anchorY="middle" color={lineColor} fontSize={0.24} position={[-width * 0.12, 0.06, z + 0.02]}>
            +
          </Text>
          <MatrixCells
            color={accent}
            cols={4}
            emphasis={(row, col) => ((row + col) % 3 === 0 ? 0.96 : 0.42)}
            height={height * 0.72}
            position={[width * 0.26, 0.04, z]}
            rows={5}
            width={width * 0.34}
          />
          <ArrowStroke color={lineColor} end={[width * 0.14, 0.06]} start={[width * 0.06, 0.06]} z={z + 0.01} />
        </group>
      )

    case 'stack':
      return (
        <group position={[0, 0, 0]}>
          {Array.from({ length: 6 }, (_, index) => {
            const stripeHeight = height / 7.4
            const y = height / 2 - stripeHeight * 0.9 - index * stripeHeight * 1.08
            return (
              <mesh key={`stack-${index}`} position={[0, y - stripeHeight / 2, z]}>
                <planeGeometry args={[width * 0.72, stripeHeight]} />
                <meshBasicMaterial
                  color={index === 2 ? lineColor : softColor}
                  opacity={index === 2 ? strongOpacity : faintOpacity + 0.18}
                  transparent
                />
              </mesh>
            )
          })}
          <ArrowStroke color={lineColor} end={[0, -height * 0.4]} start={[0, height * 0.42]} z={z + 0.01} />
          <RectFrame color={lineColor} height={height} opacity={faintOpacity} width={width * 0.78} z={z + 0.005} />
        </group>
      )

    case 'transformer-block':
      return (
        <group position={[0, 0.02, 0]}>
          <RectFrame color={lineColor} height={height * 0.88} opacity={strongOpacity * 0.7} width={width * 0.86} z={z + 0.01} />
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.82}
            height={height * 0.52}
            position={[-width * 0.26, 0, z]}
            rows={4}
            width={width * 0.08}
          />
          <mesh position={[width * 0.08, height * 0.17, z]}>
            <planeGeometry args={[width * 0.32, height * 0.2]} />
            <meshBasicMaterial color={softColor} opacity={faintOpacity + 0.12} transparent />
          </mesh>
          <mesh position={[width * 0.08, -height * 0.16, z]}>
            <planeGeometry args={[width * 0.32, height * 0.2]} />
            <meshBasicMaterial color={softColor} opacity={faintOpacity + 0.12} transparent />
          </mesh>
          <ArrowStroke color={lineColor} end={[width * 0.28, height * 0.17]} start={[-width * 0.2, height * 0.17]} z={z + 0.01} />
          <ArrowStroke color={lineColor} end={[width * 0.28, -height * 0.16]} start={[-width * 0.2, -height * 0.16]} z={z + 0.01} />
          <ArrowStroke color={lineColor} end={[-width * 0.22, -height * 0.28]} start={[-width * 0.22, height * 0.3]} z={z + 0.01} />
        </group>
      )

    case 'norm':
      return (
        <group position={[0, 0.03, 0]}>
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={(row) => (row === 2 ? 1 : 0.46)}
            height={height * 0.7}
            position={[-width * 0.22, 0, z]}
            rows={5}
            width={width * 0.12}
          />
          <mesh position={[0, 0.12, z]}>
            <planeGeometry args={[width * 0.22, height * 0.16]} />
            <meshBasicMaterial color={softColor} opacity={faintOpacity + 0.18} transparent />
          </mesh>
          <Text anchorX="center" anchorY="middle" color={lineColor} fontSize={0.16} position={[0, 0.12, z + 0.02]}>
            mu,sigma
          </Text>
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={(row) => (row === 1 || row === 3 ? 0.94 : 0.62)}
            height={height * 0.7}
            position={[width * 0.24, 0, z]}
            rows={5}
            width={width * 0.12}
          />
          <ArrowStroke color={lineColor} end={[width * 0.12, 0]} start={[-width * 0.09, 0]} z={z + 0.01} />
        </group>
      )

    case 'attention-qkv':
      return (
        <group position={[0, 0.03, 0]}>
          {[
            { x: -width * 0.26, label: 'Q' },
            { x: 0, label: 'K' },
            { x: width * 0.26, label: 'V' },
          ].map((entry, index) => (
            <group key={entry.label} position={[entry.x, 0.04, 0]}>
              <MatrixCells
                color={accent}
                cols={1}
                emphasis={(row) => (row === index + 1 ? 1 : 0.46)}
                height={height * 0.64}
                position={[0, 0, z]}
                rows={4}
                width={width * 0.1}
              />
              <Text anchorX="center" anchorY="middle" color={lineColor} fontSize={0.16} position={[0, -height * 0.42, z + 0.02]}>
                {entry.label}
              </Text>
            </group>
          ))}
        </group>
      )

    case 'attention-matrix':
      return (
        <group position={[0, 0.03, 0]}>
          <MatrixCells
            color={accent}
            cols={5}
            emphasis={(row, col) => {
              if (col > row) {
                return 0.05
              }
              return row === 3 ? 0.98 : 0.44
            }}
            height={height * 0.72}
            position={[-width * 0.1, 0, z]}
            rows={5}
            width={width * 0.5}
          />
          <RectFrame color={lineColor} height={height * 0.72} opacity={faintOpacity} width={width * 0.5} z={z + 0.005} />
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.92}
            height={height * 0.52}
            position={[width * 0.29, 0, z]}
            rows={4}
            width={width * 0.1}
          />
          <ArrowStroke color={lineColor} end={[width * 0.18, 0]} start={[width * 0.05, 0]} z={z + 0.01} />
        </group>
      )

    case 'projection':
      return (
        <group position={[0, 0.03, 0]}>
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.84}
            height={height * 0.62}
            position={[-width * 0.25, 0, z]}
            rows={5}
            width={width * 0.1}
          />
          <MatrixCells
            color={accent}
            cols={4}
            emphasis={(row, col) => (col === 2 || row === 1 ? 0.96 : 0.34)}
            height={height * 0.72}
            position={[width * 0.1, 0, z]}
            rows={5}
            width={width * 0.36}
          />
          <ArrowStroke color={lineColor} end={[-width * 0.02, 0]} start={[-width * 0.15, 0]} z={z + 0.01} />
        </group>
      )

    case 'residual':
      return (
        <group position={[0, 0.03, 0]}>
          <ArrowStroke color={lineColor} end={[0, 0.02]} start={[-width * 0.34, height * 0.22]} z={z + 0.01} />
          <ArrowStroke color={lineColor} end={[0, -0.02]} start={[-width * 0.34, -height * 0.24]} z={z + 0.01} />
          <Line color={lineColor} lineWidth={1} opacity={strongOpacity} points={createCirclePoints(0.18, z + 0.01)} transparent />
          <Text anchorX="center" anchorY="middle" color={lineColor} fontSize={0.22} position={[0, 0, z + 0.02]}>
            +
          </Text>
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.88}
            height={height * 0.58}
            position={[width * 0.28, 0, z]}
            rows={4}
            width={width * 0.1}
          />
          <ArrowStroke color={lineColor} end={[width * 0.18, 0]} start={[0.22, 0]} z={z + 0.01} />
        </group>
      )

    case 'attention':
      return (
        <group position={[0, 0.03, 0]}>
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={(row) => (row === 1 ? 1 : 0.42)}
            height={height * 0.48}
            position={[-width * 0.3, height * 0.12, z]}
            rows={3}
            width={width * 0.08}
          />
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={(row) => (row === 0 ? 1 : 0.42)}
            height={height * 0.48}
            position={[-width * 0.18, height * 0.12, z]}
            rows={3}
            width={width * 0.08}
          />
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={(row) => (row === 2 ? 1 : 0.42)}
            height={height * 0.48}
            position={[-width * 0.06, height * 0.12, z]}
            rows={3}
            width={width * 0.08}
          />
          <MatrixCells
            color={accent}
            cols={4}
            emphasis={(row, col) => (col > row ? 0.05 : row === 2 ? 0.96 : 0.36)}
            height={height * 0.56}
            position={[width * 0.12, 0, z]}
            rows={4}
            width={width * 0.34}
          />
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.92}
            height={height * 0.44}
            position={[width * 0.34, -height * 0.08, z]}
            rows={3}
            width={width * 0.08}
          />
          <ArrowStroke color={lineColor} end={[width * 0.02, 0]} start={[-width * 0.02, 0.1]} z={z + 0.01} />
          <ArrowStroke color={lineColor} end={[width * 0.28, -height * 0.08]} start={[width * 0.22, -height * 0.08]} z={z + 0.01} />
        </group>
      )

    case 'mlp-up':
      return (
        <group position={[0, 0.03, 0]}>
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.88}
            height={height * 0.48}
            position={[-width * 0.27, 0, z]}
            rows={3}
            width={width * 0.08}
          />
          <ArrowStroke color={lineColor} end={[-width * 0.02, 0]} start={[-width * 0.16, 0]} z={z + 0.01} />
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={(row) => (row === 2 || row === 5 ? 1 : 0.44)}
            height={height * 0.72}
            position={[width * 0.18, 0, z]}
            rows={6}
            width={width * 0.1}
          />
        </group>
      )

    case 'mlp-activation': {
      const graphWidth = width * 0.52
      const graphHeight = height * 0.46
      const pathPoints: [number, number, number][] = Array.from({ length: 24 }, (_, index) => {
        const t = index / 23
        const x = -graphWidth / 2 + t * graphWidth
        const input = -2.8 + t * 5.6
        const yValue = input * 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (input + 0.044715 * input ** 3)))
        const y = THREE.MathUtils.clamp((yValue / 3.2) * graphHeight, -graphHeight / 2, graphHeight / 2)
        return [x, y, z + 0.01]
      })

      return (
        <group position={[0, 0.02, 0]}>
          <Line
            color={shiftColor(accent, 0.26, 0.04)}
            lineWidth={1}
            opacity={strongOpacity}
            points={[
              [-graphWidth / 2, 0, z],
              [graphWidth / 2, 0, z],
            ]}
            transparent
          />
          <Line
            color={shiftColor(accent, 0.26, 0.04)}
            lineWidth={1}
            opacity={strongOpacity}
            points={[
              [0, -graphHeight / 2, z],
              [0, graphHeight / 2, z],
            ]}
            transparent
          />
          <Line color={lineColor} lineWidth={1.4} opacity={strongOpacity} points={pathPoints} transparent />
        </group>
      )
    }

    case 'mlp-down':
      return (
        <group position={[0, 0.03, 0]}>
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={(row) => (row === 2 || row === 4 ? 1 : 0.42)}
            height={height * 0.72}
            position={[-width * 0.18, 0, z]}
            rows={6}
            width={width * 0.1}
          />
          <ArrowStroke color={lineColor} end={[width * 0.04, 0]} start={[-width * 0.02, 0]} z={z + 0.01} />
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.9}
            height={height * 0.48}
            position={[width * 0.24, 0, z]}
            rows={3}
            width={width * 0.08}
          />
        </group>
      )

    case 'mlp':
      return (
        <group position={[0, 0.03, 0]}>
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.86}
            height={height * 0.42}
            position={[-width * 0.34, 0, z]}
            rows={3}
            width={width * 0.08}
          />
          <ArrowStroke color={lineColor} end={[-width * 0.16, 0]} start={[-width * 0.24, 0]} z={z + 0.01} />
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={(row) => (row === 2 || row === 4 ? 1 : 0.38)}
            height={height * 0.66}
            position={[-width * 0.02, 0, z]}
            rows={6}
            width={width * 0.08}
          />
          <Line
            color={lineColor}
            lineWidth={1.2}
            opacity={strongOpacity}
            points={[
              [width * 0.12, -height * 0.12, z + 0.01],
              [width * 0.18, 0, z + 0.01],
              [width * 0.26, height * 0.12, z + 0.01],
            ]}
            transparent
          />
          <ArrowStroke color={lineColor} end={[width * 0.36, 0]} start={[width * 0.28, 0]} z={z + 0.01} />
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.92}
            height={height * 0.42}
            position={[width * 0.46, 0, z]}
            rows={3}
            width={width * 0.08}
          />
        </group>
      )

    case 'lm-head':
      return (
        <group position={[0, 0.04, 0]}>
          <MatrixCells
            color={accent}
            cols={1}
            emphasis={() => 0.9}
            height={height * 0.46}
            position={[-width * 0.34, 0, z]}
            rows={3}
            width={width * 0.08}
          />
          <ArrowStroke color={lineColor} end={[-width * 0.12, 0]} start={[-width * 0.24, 0]} z={z + 0.01} />
          <MatrixCells
            color={accent}
            cols={5}
            emphasis={(row, col) => (col === 2 || row === 1 ? 0.96 : 0.36)}
            height={height * 0.62}
            position={[width * 0.12, 0, z]}
            rows={4}
            width={width * 0.42}
          />
          <DistributionBars color={accent} count={6} height={height * 0.48} opacity={strongOpacity} pattern={[0.18, 0.28, 0.42, 0.22, 0.8, 0.34]} width={width * 0.22} z={z} />
        </group>
      )

    case 'softmax':
      return (
        <group position={[0, 0.03, 0]}>
          <DistributionBars
            color={accent}
            count={7}
            height={height * 0.7}
            opacity={strongOpacity}
            pattern={[0.14, 0.18, 0.22, 0.3, 0.78, 0.24, 0.16]}
            width={width * 0.72}
            z={z}
          />
          <Line
            color={lineColor}
            lineWidth={1}
            opacity={faintOpacity + 0.16}
            points={[
              [-width * 0.38, -height * 0.34, z + 0.01],
              [width * 0.38, -height * 0.34, z + 0.01],
            ]}
            transparent
          />
        </group>
      )

    default:
      return null
  }
}

function colorForTone(baseHex: string, tone: ModuleTone) {
  const color = new THREE.Color(baseHex)

  switch (tone) {
    case 'input':
      color.offsetHSL(0.01, 0.02, 0.18)
      break
    case 'weight':
      color.offsetHSL(-0.01, -0.08, 0.25)
      break
    case 'activation':
      color.offsetHSL(0.02, 0.06, 0.08)
      break
    case 'aggregation':
      color.offsetHSL(0.04, -0.1, 0.3)
      break
    case 'residual':
      color.offsetHSL(0, 0.03, -0.02)
      break
    case 'shell':
      color.offsetHSL(0, -0.12, 0.12)
      break
  }

  return `#${color.getHexString()}`
}

function buildScene(detailMode: 'basic' | 'advanced') {
  return GPT_EXHIBITION_MODELS.map((model, index) => buildModelScene(model, index, detailMode))
}

function buildModelScene(
  model: ExhibitionModel,
  index: number,
  detailMode: 'basic' | 'advanced',
): SceneModel {
  const originX = index * MODEL_SPACING - ((GPT_EXHIBITION_MODELS.length - 1) * MODEL_SPACING) / 2
  const stackHeight = 8 + Math.log2(model.layers + 1) * 3.2
  const stackWidth = 3 + Math.log2(model.hiddenSize + 1) * 0.42
  const topY = stackHeight / 2 + 4.2
  const bottomY = -stackHeight / 2 - 5.6
  const detailX = originX - stackWidth / 2 - 6.2
  const detailFarX = detailX - 3.6
  const visibleBlocks = Math.max(3, Math.min(9, Math.round(model.layers / 10) + 2))
  const blockGap = 0.22
  const blockHeight = Math.max(0.6, stackHeight / visibleBlocks - blockGap)

  const modules: SceneModule[] = [
    {
      id: `${model.id}-tokens`,
      label: 'Tokens',
      modelId: model.id,
      position: [originX, topY + 2.1, 0],
      size: [2.8, 0.7, 1.4],
      tone: 'input',
      glyphKind: 'tokens',
      primarySection: 'preliminaries',
      sectionIds: ['overview', 'introduction', 'preliminaries'],
      isMacro: true,
    },
    {
      id: `${model.id}-token-embed`,
      label: 'Token Embed',
      modelId: model.id,
      position: [originX - 4.4, topY, 0],
      size: [2.4, 1.2, 1.2],
      tone: 'weight',
      glyphKind: 'embedding-source',
      primarySection: 'embedding',
      sectionIds: ['overview', 'introduction', 'preliminaries', 'embedding'],
      isMacro: true,
    },
    {
      id: `${model.id}-pos-embed`,
      label: 'Position Embed',
      modelId: model.id,
      position: [originX + 4.4, topY, 0],
      size: [2.4, 1.2, 1.2],
      tone: 'weight',
      glyphKind: 'embedding-source',
      primarySection: 'embedding',
      sectionIds: ['overview', 'introduction', 'preliminaries', 'embedding'],
      isMacro: true,
    },
    {
      id: `${model.id}-input-embed`,
      label: 'Input Embed',
      modelId: model.id,
      position: [originX, topY - 2, 0],
      size: [3.4, 1.25, 1.8],
      tone: 'activation',
      glyphKind: 'embedding-result',
      primarySection: 'embedding',
      sectionIds: ['overview', 'introduction', 'embedding'],
      isMacro: true,
    },
    {
      id: `${model.id}-stack-shell`,
      label: `${model.layers}x Blocks`,
      modelId: model.id,
      position: [originX, 0, 0],
      size: [stackWidth, stackHeight, 2.6],
      tone: 'shell',
      glyphKind: 'stack',
      primarySection: 'transformer',
      sectionIds: ['overview', 'introduction', 'preliminaries', 'transformer'],
      isMacro: true,
    },
  ]

  for (let blockIndex = 0; blockIndex < visibleBlocks; blockIndex += 1) {
    const y =
      stackHeight / 2 -
      blockHeight / 2 -
      blockIndex * (blockHeight + blockGap) -
      0.15

    modules.push({
      id: `${model.id}-block-${blockIndex}`,
      label: 'Transformer Block',
      modelId: model.id,
      position: [originX, y, 0],
      size: [stackWidth - 0.35, blockHeight, 2.2],
      tone: 'residual',
      glyphKind: 'transformer-block',
      primarySection: 'transformer',
      sectionIds: ['transformer', 'introduction'],
    })
  }

  if (detailMode === 'advanced') {
    modules.push(
      {
        id: `${model.id}-ln1`,
        label: 'LayerNorm 1',
        modelId: model.id,
        position: [detailX, 3.6, 0],
        size: [2.2, 1, 1.3],
        tone: 'aggregation',
        glyphKind: 'norm',
        primarySection: 'layer-norm',
        sectionIds: ['layer-norm', 'preliminaries'],
      },
      {
        id: `${model.id}-attn-qkv`,
        label: 'QKV',
        modelId: model.id,
        position: [detailX, 1.4, 0],
        size: [2.6, 1.35, 1.5],
        tone: 'weight',
        glyphKind: 'attention-qkv',
        primarySection: 'self-attention',
        sectionIds: ['self-attention'],
      },
      {
        id: `${model.id}-attn-matrix`,
        label: 'Attention',
        modelId: model.id,
        position: [detailFarX, 1.4, 0],
        size: [2.8, 1.7, 1.25],
        tone: 'activation',
        glyphKind: 'attention-matrix',
        primarySection: 'self-attention',
        sectionIds: ['self-attention'],
      },
      {
        id: `${model.id}-projection`,
        label: 'Projection',
        modelId: model.id,
        position: [detailX, -0.9, 0],
        size: [2.5, 1.1, 1.4],
        tone: 'weight',
        glyphKind: 'projection',
        primarySection: 'projection',
        sectionIds: ['projection'],
      },
      {
        id: `${model.id}-attn-residual`,
        label: 'Residual Add',
        modelId: model.id,
        position: [originX, -0.9, 0],
        size: [3, 0.9, 1.8],
        tone: 'residual',
        glyphKind: 'residual',
        primarySection: 'projection',
        sectionIds: ['projection', 'transformer'],
      },
      {
        id: `${model.id}-ln2`,
        label: 'LayerNorm 2',
        modelId: model.id,
        position: [detailX, -3.2, 0],
        size: [2.2, 1, 1.3],
        tone: 'aggregation',
        glyphKind: 'norm',
        primarySection: 'layer-norm',
        sectionIds: ['layer-norm'],
      },
      {
        id: `${model.id}-mlp-up`,
        label: 'MLP Up',
        modelId: model.id,
        position: [detailX, -5.35, 0],
        size: [2.7, 1.2, 1.5],
        tone: 'weight',
        glyphKind: 'mlp-up',
        primarySection: 'mlp',
        sectionIds: ['mlp'],
      },
      {
        id: `${model.id}-mlp-act`,
        label: 'GELU',
        modelId: model.id,
        position: [detailFarX, -5.35, 0],
        size: [2.3, 1, 1.2],
        tone: 'activation',
        glyphKind: 'mlp-activation',
        primarySection: 'mlp',
        sectionIds: ['mlp'],
      },
      {
        id: `${model.id}-mlp-down`,
        label: 'MLP Down',
        modelId: model.id,
        position: [detailX, -7.45, 0],
        size: [2.7, 1.1, 1.5],
        tone: 'weight',
        glyphKind: 'mlp-down',
        primarySection: 'mlp',
        sectionIds: ['mlp'],
      },
      {
        id: `${model.id}-mlp-residual`,
        label: 'MLP Residual',
        modelId: model.id,
        position: [originX, -7.45, 0],
        size: [3.1, 0.95, 1.8],
        tone: 'residual',
        glyphKind: 'residual',
        primarySection: 'mlp',
        sectionIds: ['mlp', 'transformer'],
      },
    )
  } else {
    modules.push(
      {
        id: `${model.id}-self-attention`,
        label: 'Self Attention',
        modelId: model.id,
        position: [detailX + 0.3, 1.1, 0],
        size: [3.2, 2.2, 1.6],
        tone: 'weight',
        glyphKind: 'attention',
        primarySection: 'self-attention',
        sectionIds: ['self-attention', 'projection'],
      },
      {
        id: `${model.id}-mlp`,
        label: 'MLP',
        modelId: model.id,
        position: [detailX + 0.3, -5.8, 0],
        size: [3.2, 2.3, 1.6],
        tone: 'weight',
        glyphKind: 'mlp',
        primarySection: 'mlp',
        sectionIds: ['mlp'],
      },
      {
        id: `${model.id}-layer-norm`,
        label: 'Layer Norm',
        modelId: model.id,
        position: [detailFarX + 0.8, -2.2, 0],
        size: [2.8, 1.8, 1.25],
        tone: 'aggregation',
        glyphKind: 'norm',
        primarySection: 'layer-norm',
        sectionIds: ['layer-norm'],
      },
    )
  }

  modules.push(
    {
      id: `${model.id}-ln-f`,
      label: 'Final Norm',
      modelId: model.id,
      position: [originX, bottomY + 2.8, 0],
      size: [3, 0.95, 1.7],
      tone: 'aggregation',
      glyphKind: 'norm',
      primarySection: 'output',
      sectionIds: ['layer-norm', 'output'],
      isMacro: true,
    },
    {
      id: `${model.id}-lm-head`,
      label: 'LM Head',
      modelId: model.id,
      position: [originX, bottomY + 0.7, 0],
      size: [3.2, 1.3, 1.8],
      tone: 'weight',
      glyphKind: 'lm-head',
      primarySection: 'output',
      sectionIds: ['output'],
      isMacro: true,
    },
    {
      id: `${model.id}-softmax`,
      label: 'Softmax',
      modelId: model.id,
      position: [originX, bottomY - 1.8, 0],
      size: [3, 1, 1.55],
      tone: 'activation',
      glyphKind: 'softmax',
      primarySection: 'softmax',
      sectionIds: ['softmax', 'output'],
      isMacro: true,
    },
  )

  return {
    id: model.id,
    originX,
    model,
    modules,
  }
}

function computeFocusPose(sceneModel: SceneModel, sectionId: ExhibitionSectionId) {
  const relevantModules =
    sectionId === 'overview'
      ? sceneModel.modules
      : sceneModel.modules.filter((module) => module.sectionIds.includes(sectionId))

  const box = new THREE.Box3()
  relevantModules.forEach((module) => {
    const [x, y, z] = module.position
    const [sx, sy, sz] = module.size
    box.expandByPoint(new THREE.Vector3(x - sx / 2, y - sy / 2, z - sz / 2))
    box.expandByPoint(new THREE.Vector3(x + sx / 2, y + sy / 2, z + sz / 2))
  })

  const target = box.isEmpty()
    ? new THREE.Vector3(sceneModel.originX, 0, 0)
    : box.getCenter(new THREE.Vector3())
  const size = box.isEmpty() ? new THREE.Vector3(8, 8, 4) : box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y * 0.9, size.z * 1.4)
  const distance = sectionId === 'overview' ? maxDim * 1.6 + 16 : maxDim * 1.75 + 8
  const position = target.clone().add(new THREE.Vector3(distance * 0.58, distance * 0.22, distance * 0.88))

  return { position, target }
}

function FocusRig({ focus }: { focus: FocusPose }) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls> | null>(null)
  const { camera } = useThree()
  const desiredPosition = useRef(focus.position.clone())
  const desiredTarget = useRef(focus.target.clone())
  const smoothPosition = useRef(focus.position.clone())
  const smoothTarget = useRef(focus.target.clone())

  useEffect(() => {
    desiredPosition.current.copy(focus.position)
    desiredTarget.current.copy(focus.target)
  }, [focus])

  useFrame((_, delta) => {
    const damp = 1 - Math.exp(-delta * 4.4)

    smoothPosition.current.lerp(desiredPosition.current, damp)
    smoothTarget.current.lerp(desiredTarget.current, damp)

    camera.position.copy(smoothPosition.current)
    camera.lookAt(smoothTarget.current)

    if (controlsRef.current) {
      controlsRef.current.target.lerp(smoothTarget.current, damp)
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      maxDistance={140}
      minDistance={12}
      rotateSpeed={0.45}
    />
  )
}

function SceneModuleMesh({
  module,
  accent,
  selected,
  activeModel,
  showLabel,
  onSelect,
}: {
  module: SceneModule
  accent: string
  selected: boolean
  activeModel: boolean
  showLabel: boolean
  onSelect: () => void
}) {
  const baseColor = colorForTone(accent, module.tone)
  const emissive = selected ? accent : baseColor
  const opacity = activeModel ? (selected ? 0.92 : 0.68) : 0.18
  const scale = selected ? 1.03 : 1
  const frameColor = selected ? accent : shiftColor(accent, 0.18, -0.05)
  const labelY = -module.size[1] / 2 + 0.14

  return (
    <group position={module.position} scale={scale}>
      <RoundedBox args={[module.size[0] + 0.12, module.size[1] + 0.12, MODULE_PANEL_DEPTH * 1.18]} radius={0.2} smoothness={4}>
        <meshStandardMaterial
          color={shiftColor(baseColor, 0.22, -0.08)}
          emissive={baseColor}
          emissiveIntensity={selected ? 0.18 : activeModel ? 0.08 : 0.02}
          opacity={activeModel ? 0.18 : 0.08}
          transparent
        />
      </RoundedBox>
      <RoundedBox args={[module.size[0], module.size[1], MODULE_PANEL_DEPTH]} onClick={onSelect} radius={0.18} smoothness={4}>
        <meshStandardMaterial
          color="#f8fbff"
          emissive={emissive}
          emissiveIntensity={selected ? 0.16 : activeModel ? 0.06 : 0.015}
          opacity={opacity}
          roughness={0.18}
          transparent
        />
      </RoundedBox>
      <RectFrame color={frameColor} height={module.size[1] - 0.08} opacity={activeModel ? (selected ? 0.92 : 0.52) : 0.16} width={module.size[0] - 0.08} z={MODULE_PANEL_DEPTH / 2 + 0.012} />
      <ModuleVectorGlyph accent={accent} activeModel={activeModel} module={module} selected={selected} />
      {showLabel ? (
        <Text
          anchorX="center"
          anchorY="middle"
          color="#0f172a"
          fontSize={Math.min(0.26, Math.max(0.16, module.size[1] * 0.22))}
          maxWidth={module.size[0] - 0.2}
          position={[0, labelY, MODULE_PANEL_DEPTH / 2 + 0.03]}
        >
          {module.label}
        </Text>
      ) : null}
    </group>
  )
}

function ModelSceneGroup({
  sceneModel,
  selectedModelId,
  selectedSectionId,
  onSelect,
}: {
  sceneModel: SceneModel
  selectedModelId: ExhibitionModelId
  selectedSectionId: ExhibitionSectionId
  onSelect: (modelId: ExhibitionModelId, sectionId: ExhibitionSectionId) => void
}) {
  const isActiveModel = selectedModelId === sceneModel.id
  const finalNormModule = sceneModel.modules[sceneModel.modules.length - 3]
  const softmaxModule = sceneModel.modules[sceneModel.modules.length - 1]

  const macroFlowPoints = useMemo(
    (): [[number, number, number], [number, number, number]][] => [
      [
        [sceneModel.originX, sceneModel.modules[0]?.position[1] ?? 0, 0],
        [sceneModel.originX, sceneModel.modules[3]?.position[1] ?? 0, 0],
      ],
      [
        [sceneModel.originX, sceneModel.modules[3]?.position[1] ?? 0, 0],
        [sceneModel.originX, 0, 0],
      ],
      [
        [sceneModel.originX, 0, 0],
        [sceneModel.originX, finalNormModule?.position[1] ?? 0, 0],
      ],
      [
        [sceneModel.originX, finalNormModule?.position[1] ?? 0, 0],
        [sceneModel.originX, softmaxModule?.position[1] ?? 0, 0],
      ],
    ],
    [finalNormModule, sceneModel, softmaxModule],
  )

  return (
    <group>
      <Html center position={[sceneModel.originX, (sceneModel.modules[0]?.position[1] ?? 0) + 4.6, 0]}>
        <div
          className={`rounded-2xl border px-3 py-2 text-center backdrop-blur-sm ${
            isActiveModel
              ? 'border-white/90 bg-white/85 shadow-[0_14px_34px_rgba(15,23,42,0.12)]'
              : 'border-white/60 bg-white/60 shadow-[0_8px_18px_rgba(15,23,42,0.06)]'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {sceneModel.model.name}
          </div>
          <div className="mt-1 text-xs text-slate-600">
            {sceneModel.model.layers} layers · {sceneModel.model.hiddenSize} hidden · {sceneModel.model.paramsLabel}
          </div>
        </div>
      </Html>

      {macroFlowPoints.map((points, index) => (
        <Line
          color={isActiveModel ? sceneModel.model.accent : '#cbd5e1'}
          key={`${sceneModel.id}-flow-${index}`}
          lineWidth={isActiveModel ? 1.2 : 0.6}
          opacity={isActiveModel ? 0.45 : 0.18}
          points={points}
          transparent
        />
      ))}

      {sceneModel.modules.map((module) => {
        const selected =
          isActiveModel &&
          (selectedSectionId === 'overview'
            ? Boolean(module.isMacro)
            : module.sectionIds.includes(selectedSectionId))

        const showLabel =
          isActiveModel &&
          (selected ||
            (selectedSectionId === 'overview' && Boolean(module.isMacro)) ||
            (module.primarySection === 'transformer' && selectedSectionId === 'transformer'))

        return (
          <SceneModuleMesh
            accent={sceneModel.model.accent}
            activeModel={isActiveModel}
            key={module.id}
            module={module}
            onSelect={() => onSelect(sceneModel.id, module.primarySection)}
            selected={selected}
            showLabel={showLabel}
          />
        )
      })}
    </group>
  )
}

function ExhibitionSceneBody({
  detailMode,
  selectedModelId,
  selectedSectionId,
  onSelect,
}: GptArchitectureExhibitionSceneProps) {
  const scene = useMemo(() => buildScene(detailMode), [detailMode])
  const selectedModel =
    scene.find((sceneModel) => sceneModel.id === selectedModelId) ??
    scene.find((sceneModel) => sceneModel.id === 'gpt2-small') ??
    scene[0]

  const focus = useMemo(
    () => computeFocusPose(selectedModel, selectedSectionId),
    [selectedModel, selectedSectionId],
  )

  return (
    <>
      <color attach="background" args={['#f9fbff']} />
      <fog attach="fog" args={['#f9fbff', 70, 150]} />

      <ambientLight intensity={1.3} />
      <directionalLight intensity={1.45} position={[18, 28, 16]} />
      <pointLight color="#dbeafe" intensity={22} position={[0, 22, 26]} />

      <gridHelper args={[180, 36, '#cbd5e1', '#e2e8f0']} position={[0, -22, 0]} />

      {scene.map((sceneModel) => (
        <ModelSceneGroup
          key={sceneModel.id}
          onSelect={onSelect}
          sceneModel={sceneModel}
          selectedModelId={selectedModelId}
          selectedSectionId={selectedSectionId}
        />
      ))}

      <FocusRig focus={focus} />
    </>
  )
}

export function GptArchitectureExhibitionScene(props: GptArchitectureExhibitionSceneProps) {
  return (
    <div className="glass-panel glass-panel-strong h-[42rem] overflow-hidden rounded-[2rem]">
      <Canvas camera={{ fov: 34, near: 0.1, far: 300, position: [20, 8, 26] }}>
        <ExhibitionSceneBody {...props} />
      </Canvas>
    </div>
  )
}
