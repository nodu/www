'use client'

import { useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

import { Mesh } from 'three'

function MeshComponent() {
  const fileUrl = '/Arm.stl'
  const mesh = useRef<Mesh>(null!)
  const stl = useLoader(STLLoader, fileUrl)

  useFrame(() => {
    mesh.current.rotation.y += 0.01
  })

  return (
    <mesh ref={mesh}>
      <primitive object={stl} />
    </mesh>
  )
}

export default function STL() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Canvas className="h-2xl w-2xl">
        <OrbitControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <MeshComponent />
      </Canvas>
    </div>
  )
}
