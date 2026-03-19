import { Float, Line, OrbitControls, Sphere, Text } from '@react-three/drei'
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
              color={['#dbeafe', '#e0f2fe', '#f1f5f9', '#dbeafe', '#e2e8f0'][index]}
              emissive={['#bfdbfe', '#bae6fd', '#e2e8f0', '#cbd5e1', '#cbd5e1'][index]}
              emissiveIntensity={0.12}
            />
          </Sphere>
        </Float>
      ))}
      <Line
        color="#cbd5e1"
        lineWidth={2}
        points={positions}
      />
      <Text color="#0f172a" fontSize={0.36} position={[-4, -0.8, 0]}>
        文本
      </Text>
      <Text color="#0f172a" fontSize={0.36} position={[-2, -0.2, 0]}>
        token
      </Text>
      <Text color="#0f172a" fontSize={0.36} position={[0, -0.9, 0]}>
        向量
      </Text>
      <Text color="#0f172a" fontSize={0.36} position={[2, -1.4, 0]}>
        Transformer
      </Text>
      <Text color="#0f172a" fontSize={0.36} position={[4, -0.8, 0]}>
        输出
      </Text>
    </>
  )
}

export function HeroScene() {
  return (
    <div className="glass-panel glass-panel-strong h-[26rem] overflow-hidden rounded-[2rem]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['#f9fdff']} />
        <ambientLight intensity={1.35} />
        <directionalLight intensity={1.75} position={[5, 5, 5]} />
        <FlowNodes />
        <OrbitControls autoRotate autoRotateSpeed={0.7} enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}
