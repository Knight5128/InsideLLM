import { Html, Line, OrbitControls, RoundedBox, Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

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

interface SceneModule {
  id: string
  label: string
  modelId: ExhibitionModelId
  position: [number, number, number]
  size: [number, number, number]
  tone: ModuleTone
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
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
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
  const opacity = activeModel ? (selected ? 0.98 : 0.7) : 0.22
  const scale = selected ? 1.03 : 1

  return (
    <group position={module.position} scale={scale}>
      <RoundedBox args={module.size} onClick={onSelect} radius={0.16} smoothness={4}>
        <meshStandardMaterial
          color={baseColor}
          emissive={emissive}
          emissiveIntensity={selected ? 0.48 : activeModel ? 0.18 : 0.05}
          opacity={opacity}
          transparent
        />
      </RoundedBox>
      {showLabel ? (
        <Text
          anchorX="center"
          anchorY="middle"
          color="#0f172a"
          fontSize={0.34}
          maxWidth={module.size[0] * 1.2}
          position={[0, 0, module.size[2] / 2 + 0.18]}
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
