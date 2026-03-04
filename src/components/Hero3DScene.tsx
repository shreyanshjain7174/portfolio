'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Floating wireframe icosahedron with glow
function CoreGeometry() {
    const meshRef = useRef<THREE.Mesh>(null)
    const wireRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.15
            meshRef.current.rotation.y = t * 0.2
        }
        if (wireRef.current) {
            wireRef.current.rotation.x = t * 0.15
            wireRef.current.rotation.y = t * 0.2
        }
    })

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
            <group>
                {/* Solid inner sphere with distortion */}
                <mesh ref={meshRef}>
                    <icosahedronGeometry args={[1.2, 1]} />
                    <MeshDistortMaterial
                        color="#8b5cf6"
                        emissive="#3b1a8b"
                        emissiveIntensity={0.5}
                        roughness={0.2}
                        metalness={0.8}
                        distort={0.3}
                        speed={2}
                        transparent
                        opacity={0.7}
                    />
                </mesh>

                {/* Wireframe overlay */}
                <mesh ref={wireRef} scale={1.01}>
                    <icosahedronGeometry args={[1.2, 1]} />
                    <meshBasicMaterial
                        color="#06b6d4"
                        wireframe
                        transparent
                        opacity={0.4}
                    />
                </mesh>

                {/* Inner glow sphere */}
                <mesh scale={0.8}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial
                        color="#3b82f6"
                        transparent
                        opacity={0.08}
                    />
                </mesh>
            </group>
        </Float>
    )
}

// Orbiting particles
function OrbitingParticles({ count = 200 }: { count?: number }) {
    const points = useRef<THREE.Points>(null)

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            // Random spherical distribution
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            const r = 2 + Math.random() * 3

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
            pos[i * 3 + 2] = r * Math.cos(phi)

            // Random colors between blue, violet, cyan
            const colorChoice = Math.random()
            if (colorChoice < 0.33) {
                colors[i * 3] = 0.23; colors[i * 3 + 1] = 0.51; colors[i * 3 + 2] = 0.96 // blue
            } else if (colorChoice < 0.66) {
                colors[i * 3] = 0.55; colors[i * 3 + 1] = 0.36; colors[i * 3 + 2] = 0.96 // violet
            } else {
                colors[i * 3] = 0.02; colors[i * 3 + 1] = 0.71; colors[i * 3 + 2] = 0.82 // cyan
            }

            sizes[i] = Math.random() * 3 + 1
        }

        return { positions: pos, colors, sizes }
    }, [count])

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.elapsedTime * 0.05
            points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
        }
    })

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[positions.colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    )
}

// Orbit rings
function OrbitRings() {
    const ring1 = useRef<THREE.Mesh>(null)
    const ring2 = useRef<THREE.Mesh>(null)
    const ring3 = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (ring1.current) {
            ring1.current.rotation.x = Math.PI / 3
            ring1.current.rotation.z = t * 0.1
        }
        if (ring2.current) {
            ring2.current.rotation.x = Math.PI / 2.5
            ring2.current.rotation.y = t * 0.08
        }
        if (ring3.current) {
            ring3.current.rotation.x = Math.PI / 4
            ring3.current.rotation.z = -t * 0.06
        }
    })

    return (
        <>
            <mesh ref={ring1}>
                <torusGeometry args={[2.5, 0.005, 16, 100]} />
                <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} />
            </mesh>
            <mesh ref={ring2}>
                <torusGeometry args={[3.0, 0.004, 16, 100]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
            </mesh>
            <mesh ref={ring3}>
                <torusGeometry args={[3.5, 0.003, 16, 100]} />
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
            </mesh>
        </>
    )
}

// Mouse-following light
function MouseLight() {
    const light = useRef<THREE.PointLight>(null)
    const { viewport } = useThree()

    useFrame((state) => {
        if (light.current) {
            light.current.position.x = (state.pointer.x * viewport.width) / 2
            light.current.position.y = (state.pointer.y * viewport.height) / 2
            light.current.position.z = 3
        }
    })

    return <pointLight ref={light} intensity={2} color="#8b5cf6" distance={8} />
}

// Main exported component
export default function Hero3DScene() {
    return (
        <div className="absolute inset-0 pointer-events-auto" style={{ zIndex: 1 }}>
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                style={{ background: 'transparent' }}
            >
                {/* Ambient light */}
                <ambientLight intensity={0.15} />

                {/* Key lights */}
                <directionalLight position={[5, 5, 5]} intensity={0.3} color="#3b82f6" />
                <directionalLight position={[-5, -3, 3]} intensity={0.2} color="#8b5cf6" />
                <pointLight position={[0, 0, 3]} intensity={0.5} color="#06b6d4" distance={10} />

                {/* Mouse-following light */}
                <MouseLight />

                {/* Core glowing geometry */}
                <CoreGeometry />

                {/* Orbiting particle field */}
                <OrbitingParticles count={150} />

                {/* Orbit rings */}
                <OrbitRings />
            </Canvas>
        </div>
    )
}
