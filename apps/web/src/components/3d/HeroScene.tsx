import { Float, Line, OrbitControls, Sphere, Stars, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

function FlowNodes() {
  const positions: [number, number, number][] = [
    [-4, 0.4, 0],
    [-2, 0.8, -0.2],
    [0, 0, 0],
    [2, -0.6, 0.2],
    [4, 0.3, 0],
  ]

  return (
    <>
      {positions.map((position, index) => (
        <Float key={position.join('-')} speed={1 + index * 0.2} rotationIntensity={0.3}>
          <Sphere args={[0.28, 32, 32]} position={position}>
            <meshStandardMaterial
              color={['#38bdf8', '#8b5cf6', '#c084fc', '#22c55e', '#f97316'][index]}
              emissive={['#0ea5e9', '#7c3aed', '#a855f7', '#22c55e', '#ea580c'][index]}
              emissiveIntensity={0.6}
            />
          </Sphere>
        </Float>
      ))}
      <Line
        color="#c084fc"
        lineWidth={2}
        points={positions}
      />
      <Text color="#f8fafc" fontSize={0.36} position={[-4, -0.8, 0]}>
        文本
      </Text>
      <Text color="#f8fafc" fontSize={0.36} position={[-2, -0.2, 0]}>
        token
      </Text>
      <Text color="#f8fafc" fontSize={0.36} position={[0, -0.9, 0]}>
        向量
      </Text>
      <Text color="#f8fafc" fontSize={0.36} position={[2, -1.4, 0]}>
        Transformer
      </Text>
      <Text color="#f8fafc" fontSize={0.36} position={[4, -0.8, 0]}>
        输出
      </Text>
    </>
  )
}

export function HeroScene() {
  return (
    <div className="h-[26rem] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.8} />
        <directionalLight intensity={1.4} position={[5, 5, 5]} />
        <Stars count={1800} radius={80} depth={40} factor={3.2} saturation={0.1} />
        <FlowNodes />
        <OrbitControls autoRotate autoRotateSpeed={0.7} enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}
