'use client'
import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Floating icosahedron core ─── */
function CoreGeometry() {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (!groupRef.current) return
        const t = state.clock.elapsedTime
        groupRef.current.rotation.x = t * 0.15
        groupRef.current.rotation.y = t * 0.2
        // gentle float
        groupRef.current.position.y = Math.sin(t * 0.8) * 0.15
    })

    return (
        <group ref={groupRef}>
            {/* Main solid */}
            <mesh>
                <icosahedronGeometry args={[1.2, 1]} />
                <meshStandardMaterial
                    color="#8b5cf6"
                    emissive="#6d28d9"
                    emissiveIntensity={0.4}
                    roughness={0.3}
                    metalness={0.9}
                    transparent
                    opacity={0.75}
                />
            </mesh>

            {/* Wireframe overlay */}
            <mesh scale={1.02}>
                <icosahedronGeometry args={[1.2, 1]} />
                <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.35} />
            </mesh>

            {/* Inner glow */}
            <mesh scale={0.75}>
                <sphereGeometry args={[1, 24, 24]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.06} />
            </mesh>
        </group>
    )
}

/* ─── Particle field ─── */
function ParticleField({ count = 150 }: { count?: number }) {
    const pointsRef = useRef<THREE.Points>(null)

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry()
        const pos = new Float32Array(count * 3)
        const cols = new Float32Array(count * 3)

        const palette = [
            [0.23, 0.51, 0.96],
            [0.55, 0.36, 0.96],
            [0.02, 0.71, 0.83],
        ]

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            const r = 2 + Math.random() * 3

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
            pos[i * 3 + 2] = r * Math.cos(phi)

            const c = palette[Math.floor(Math.random() * 3)]
            cols[i * 3] = c[0]
            cols[i * 3 + 1] = c[1]
            cols[i * 3 + 2] = c[2]
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        geo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
        return geo
    }, [count])

    useFrame((state) => {
        if (!pointsRef.current) return
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
        pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
    })

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial
                size={0.035}
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

/* ─── Orbit rings ─── */
function OrbitRings() {
    const refs = [
        useRef<THREE.Mesh>(null),
        useRef<THREE.Mesh>(null),
        useRef<THREE.Mesh>(null),
    ]

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (refs[0].current) { refs[0].current.rotation.x = Math.PI / 3; refs[0].current.rotation.z = t * 0.1 }
        if (refs[1].current) { refs[1].current.rotation.x = Math.PI / 2.5; refs[1].current.rotation.y = t * 0.08 }
        if (refs[2].current) { refs[2].current.rotation.x = Math.PI / 4; refs[2].current.rotation.z = -t * 0.06 }
    })

    const rings = [
        { r: 2.5, w: 0.006, col: '#8b5cf6', op: 0.2 },
        { r: 3.0, w: 0.005, col: '#3b82f6', op: 0.15 },
        { r: 3.5, w: 0.004, col: '#06b6d4', op: 0.1 },
    ]

    return (
        <>
            {rings.map((ring, i) => (
                <mesh key={i} ref={refs[i]}>
                    <torusGeometry args={[ring.r, ring.w, 16, 100]} />
                    <meshBasicMaterial color={ring.col} transparent opacity={ring.op} />
                </mesh>
            ))}
        </>
    )
}

/* ─── Mouse-following light ─── */
function MouseLight() {
    const light = useRef<THREE.PointLight>(null)
    const { viewport } = useThree()

    useFrame((state) => {
        if (!light.current) return
        light.current.position.x = (state.pointer.x * viewport.width) / 2
        light.current.position.y = (state.pointer.y * viewport.height) / 2
        light.current.position.z = 3
    })

    return <pointLight ref={light} intensity={2} color="#8b5cf6" distance={8} />
}

/* ─── Scene wrapper with error boundary ─── */
function Scene() {
    return (
        <>
            <ambientLight intensity={0.15} />
            <directionalLight position={[5, 5, 5]} intensity={0.3} color="#3b82f6" />
            <directionalLight position={[-5, -3, 3]} intensity={0.2} color="#8b5cf6" />
            <pointLight position={[0, 0, 3]} intensity={0.5} color="#06b6d4" distance={10} />
            <MouseLight />
            <CoreGeometry />
            <ParticleField count={150} />
            <OrbitRings />
        </>
    )
}

/* ─── Main export ─── */
export default function Hero3DScene() {
    const [mounted, setMounted] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        // only render on client and skip if WebGL is unavailable
        try {
            const canvas = document.createElement('canvas')
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
            if (!gl) {
                setHasError(true)
                return
            }
        } catch {
            setHasError(true)
            return
        }
        setMounted(true)
    }, [])

    if (!mounted || hasError) return null

    return (
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                style={{ background: 'transparent' }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0)
                }}
            >
                <Scene />
            </Canvas>
        </div>
    )
}
