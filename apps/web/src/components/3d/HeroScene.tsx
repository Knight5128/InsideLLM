import { Float, Line, OrbitControls, Sphere, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

type Point3D = [number, number, number]

const HERO_BACKGROUND_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4'

const tokenPoints: Point3D[] = [
  [-2.9, 0.9, 0.15],
  [-2.15, 0.15, 0],
  [-2.85, -0.62, -0.1],
]

const embeddingPoints: Point3D[] = [
  [-0.9, -0.25, 0],
  [-0.6, 0.15, 0],
  [-0.3, 0.48, 0],
  [0, 0.08, 0],
  [0.3, -0.4, 0],
]

const transformerPoints: Point3D[] = [
  [1.65, 0.72, 0.15],
  [2.05, 0.05, 0],
  [2.45, -0.64, -0.1],
]

const outputPoints: Point3D[] = [
  [4.35, 0.98, 0.18],
  [4.75, 0.2, 0],
  [4.35, -0.56, -0.12],
]

function StageCaption({
  position,
  title,
  subtitle,
}: {
  position: Point3D
  title: string
  subtitle: string
}) {
  return (
    <group position={position}>
      <Text anchorX="center" color="#0f172a" fontSize={0.28}>
        {title}
      </Text>
      <Text anchorX="center" color="#64748b" fontSize={0.14} position={[0, -0.32, 0]}>
        {subtitle}
      </Text>
    </group>
  )
}

function Connection({
  points,
  color = '#cbd5e1',
}: {
  points: Point3D[]
  color?: string
}) {
  return <Line color={color} lineWidth={1.1} points={points} transparent opacity={0.95} />
}

function PromptSource() {
  return (
    <Float rotationIntensity={0.16} speed={1.2}>
      <group position={[-4.65, 0.15, 0]}>
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[1.55, 1.85, 0.16]} />
          <meshStandardMaterial color="#f8fafc" emissive="#e0f2fe" emissiveIntensity={0.08} />
        </mesh>
        {[
          [0, 0.46, 0.02, 0.84],
          [-0.1, 0.1, 0.02, 1.04],
          [0.08, -0.25, 0.02, 0.72],
        ].map(([x, y, z, width]) => (
          <mesh key={`${x}-${y}-${width}`} position={[x, y, z]}>
            <boxGeometry args={[width, 0.1, 0.06]} />
            <meshStandardMaterial color="#94a3b8" emissive="#dbeafe" emissiveIntensity={0.04} />
          </mesh>
        ))}
        <mesh position={[-0.46, -0.68, 0.02]}>
          <boxGeometry args={[0.48, 0.16, 0.06]} />
          <meshStandardMaterial color="#bfdbfe" emissive="#bfdbfe" emissiveIntensity={0.12} />
        </mesh>
      </group>
    </Float>
  )
}

function TokenBranch() {
  const labels = ['tok 1', 'tok 2', 'tok 3']

  return (
    <>
      {tokenPoints.map((position, index) => (
        <Float key={labels[index]} rotationIntensity={0.22} speed={1.2 + index * 0.16}>
          <group position={position}>
            <mesh>
              <boxGeometry args={[0.72, 0.34, 0.16]} />
              <meshStandardMaterial
                color={index === 1 ? '#e0f2fe' : '#eff6ff'}
                emissive={index === 1 ? '#bae6fd' : '#dbeafe'}
                emissiveIntensity={0.1}
              />
            </mesh>
            <Text color="#0f172a" fontSize={0.12} position={[0, -0.01, 0.1]}>
              {labels[index]}
            </Text>
          </group>
        </Float>
      ))}
    </>
  )
}

function EmbeddingField() {
  const heights = [0.42, 0.86, 1.2, 0.72, 1.04]

  return (
    <Float rotationIntensity={0.12} speed={1}>
      <group position={[-0.25, -0.05, 0]}>
        {heights.map((height, index) => (
          <mesh key={height} position={[-0.62 + index * 0.32, -0.48 + height / 2, 0]}>
            <boxGeometry args={[0.18, height, 0.18]} />
            <meshStandardMaterial
              color={index === 2 ? '#7dd3fc' : '#cbd5e1'}
              emissive={index === 2 ? '#38bdf8' : '#dbeafe'}
              emissiveIntensity={index === 2 ? 0.28 : 0.08}
            />
          </mesh>
        ))}
        <mesh position={[0, -0.78, -0.02]}>
          <boxGeometry args={[1.9, 0.08, 0.32]} />
          <meshStandardMaterial color="#e2e8f0" emissive="#f8fafc" emissiveIntensity={0.08} />
        </mesh>
      </group>
    </Float>
  )
}

function TransformerStack() {
  return (
    <Float rotationIntensity={0.18} speed={1.1}>
      <group position={[2.05, 0.08, 0]}>
        {[0.56, 0, -0.56].map((y, index) => (
          <mesh key={y} position={[0, y, index * 0.08 - 0.08]}>
            <boxGeometry args={[1.35, 0.34, 0.22]} />
            <meshStandardMaterial
              color={index === 1 ? '#e0f2fe' : '#f8fafc'}
              emissive={index === 1 ? '#bae6fd' : '#dbeafe'}
              emissiveIntensity={index === 1 ? 0.18 : 0.08}
              transparent
              opacity={0.92}
            />
          </mesh>
        ))}
        <Sphere args={[0.12, 24, 24]} position={[-0.48, 0.56, 0.16]}>
          <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.44} />
        </Sphere>
        <Sphere args={[0.12, 24, 24]} position={[0, 0, 0.22]}>
          <meshStandardMaterial color="#38bdf8" emissive="#7dd3fc" emissiveIntensity={0.52} />
        </Sphere>
        <Sphere args={[0.12, 24, 24]} position={[0.48, -0.56, 0.16]}>
          <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.44} />
        </Sphere>
        <Connection
          color="#94a3b8"
          points={[
            [-0.48, 0.56, 0.16],
            [0, 0, 0.22],
            [0.48, -0.56, 0.16],
          ]}
        />
      </group>
    </Float>
  )
}

function OutputCandidates() {
  const outputs = [
    { label: '候选 A', active: false, position: outputPoints[0] },
    { label: '候选 B', active: false, position: outputPoints[1] },
    { label: '最终输出', active: true, position: outputPoints[2] },
  ]

  return (
    <>
      {outputs.map(({ label, active, position }, index) => (
        <Float key={label} rotationIntensity={0.18} speed={1.15 + index * 0.08}>
          <group position={position}>
            <mesh>
              <boxGeometry args={[1.08, 0.34, 0.18]} />
              <meshStandardMaterial
                color={active ? '#dbeafe' : '#f8fafc'}
                emissive={active ? '#7dd3fc' : '#e2e8f0'}
                emissiveIntensity={active ? 0.24 : 0.08}
              />
            </mesh>
            <Text color={active ? '#0369a1' : '#475569'} fontSize={0.12} position={[0, -0.01, 0.1]}>
              {label}
            </Text>
          </group>
        </Float>
      ))}
    </>
  )
}

function FlowNodes() {
  return (
    <>
      <mesh position={[0.1, -1.88, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11.2, 4.8]} />
        <meshStandardMaterial color="#ffffff" opacity={0.32} transparent />
      </mesh>

      <PromptSource />
      <TokenBranch />
      <EmbeddingField />
      <TransformerStack />
      <OutputCandidates />

      {tokenPoints.map((point) => (
        <Connection
          key={`prompt-${point.join('-')}`}
          points={[
            [-3.85, 0.18, 0.02],
            [-3.35, point[1] * 0.7, 0.03],
            point,
          ]}
        />
      ))}

      {tokenPoints.map((point, index) => (
        <Connection
          key={`embedding-${point.join('-')}`}
          points={[point, embeddingPoints[index], [0.1, 0.04, 0.02]]}
        />
      ))}

      {transformerPoints.map((point, index) => (
        <Connection
          key={`transformer-${point.join('-')}`}
          color="#94a3b8"
          points={[embeddingPoints[index + 1], [1.1, 0.04, 0.04], point]}
        />
      ))}

      {outputPoints.map((point, index) => (
        <Connection
          key={`output-${point.join('-')}`}
          color={index === 2 ? '#7dd3fc' : '#cbd5e1'}
          points={[transformerPoints[index], [3.35, point[1] * 0.65, 0.08], point]}
        />
      ))}

      <StageCaption position={[-4.65, -1.25, 0]} subtitle="原始提示词" title="文本输入" />
      <StageCaption position={[-2.45, -1.25, 0]} subtitle="切成更小单元" title="Token 化" />
      <StageCaption position={[-0.22, -1.25, 0]} subtitle="映射到数值空间" title="向量表示" />
      <StageCaption position={[2.05, -1.25, 0]} subtitle="多层上下文计算" title="Transformer" />
      <StageCaption position={[4.45, -1.25, 0]} subtitle="从候选中采样" title="输出生成" />

      <Text anchorX="left" color="#0f172a" fontSize={0.2} position={[-5.15, 1.72, 0]}>
        Prompt to Response
      </Text>
      <Text anchorX="left" color="#64748b" fontSize={0.13} position={[-5.15, 1.42, 0]}>
        从文本切分、编码到推理与生成，不再只是五个点的直线。
      </Text>
    </>
  )
}

export function HeroScene() {
  return (
    <div className="glass-panel glass-panel-strong relative h-[26rem] overflow-hidden rounded-[2rem]">
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={HERO_BACKGROUND_VIDEO_URL} type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0) 26.416%, rgb(255,255,255) 66.943%)',
        }}
      />
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="relative z-10" gl={{ alpha: true }}>
        <fog attach="fog" args={['#f9fdff', 8.5, 15]} />
        <ambientLight intensity={1.45} />
        <directionalLight intensity={1.9} position={[5, 5, 5]} />
        <pointLight intensity={0.7} position={[-4, 2, 2]} color="#bae6fd" />
        <pointLight intensity={0.55} position={[4, -1, 2]} color="#bfdbfe" />
        <FlowNodes />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.45}
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 1.95}
          minPolarAngle={Math.PI / 2.45}
        />
      </Canvas>
    </div>
  )
}
