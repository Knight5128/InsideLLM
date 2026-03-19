import { Html, OrbitControls, RoundedBox, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo, useState } from 'react'

interface TransformerSceneProps {
  detailMode: 'basic' | 'advanced'
}

type SceneNode = {
  id: string
  label: string
  color: string
  x: number
  detail: string
}

function SceneBody({ detailMode }: TransformerSceneProps) {
  const [selectedId, setSelectedId] = useState('embedding')

  const nodes = useMemo<SceneNode[]>(() => {
    const base = [
      {
        id: 'input',
        label: 'Input Text',
        color: '#dbeafe',
        x: -5.2,
        detail: '原始字符序列进入 tokenizer 之前，只是人类可读文本。',
      },
      {
        id: 'tokenizer',
        label: 'Tokenizer',
        color: '#e0f2fe',
        x: -3.2,
        detail: '把文本切成 token，并映射成离散 token IDs。',
      },
      {
        id: 'embedding',
        label: 'Embedding',
        color: '#f1f5f9',
        x: -1.2,
        detail: '每个 token 从词表中查表拿到初始向量，再叠加位置信息。',
      },
      {
        id: 'blocks',
        label: detailMode === 'basic' ? 'Transformer Blocks' : 'Attention + MLP + Residual',
        color: '#dbeafe',
        x: 1.6,
        detail:
          detailMode === 'basic'
            ? '多个 block 反复更新 token 的上下文表示。'
            : '展开后可以看到注意力、MLP、残差连接和归一化共同完成上下文化。',
      },
      {
        id: 'output',
        label: 'Output Head',
        color: '#e2e8f0',
        x: 4.4,
        detail: '输出头把最终隐藏状态映射到下一个 token 的预测分布。',
      },
    ]

    return base
  }, [detailMode])

  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0]

  return (
    <>
      {nodes.map((node, index) => (
        <group key={node.id} position={[node.x, 0, index % 2 === 0 ? 0 : 0.3]}>
          <RoundedBox
            args={[1.55, detailMode === 'advanced' && node.id === 'blocks' ? 2.3 : 1.4, 0.8]}
            onClick={() => setSelectedId(node.id)}
            radius={0.18}
            smoothness={4}
          >
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.28} />
          </RoundedBox>
          <Text color="#0f172a" fontSize={0.18} maxWidth={1.2} position={[0, 0, 0.5]}>
            {node.label}
          </Text>
        </group>
      ))}
      <Html position={[0, -2.4, 0]} transform>
        <div className="glass-panel w-72 rounded-2xl p-4 text-slate-700">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">点击组件查看解释</div>
          <div className="mt-2 text-lg font-semibold">{selected.label}</div>
          <p className="mt-2 text-sm text-slate-600">{selected.detail}</p>
        </div>
      </Html>
    </>
  )
}

export function TransformerScene({ detailMode }: TransformerSceneProps) {
  return (
    <div className="glass-panel glass-panel-strong h-[30rem] overflow-hidden rounded-[2rem]">
      <Canvas camera={{ position: [0, 0.8, 10], fov: 42 }}>
        <color attach="background" args={['#f9fdff']} />
        <ambientLight intensity={1.2} />
        <spotLight angle={0.4} intensity={1.7} penumbra={1} position={[6, 8, 6]} />
        <SceneBody detailMode={detailMode} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  )
}
