'use client'

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox, Text } from '@react-three/drei'
import { CuboidCollider, Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier'

export type BlockSpec = {
  id: number
  kind: 'draft' | 'book'
  title: string
  tag: string
  author?: string
  color: string
  ink: string
  size: [number, number, number]
  position: [number, number, number]
  rotation: [number, number, number]
}

export type Bounds = { w: number; d: number }

type Props = {
  blocks: BlockSpec[]
  bounds: Bounds
  shake: number
  active: boolean
  onBlockClick: (id: number) => void
}

const SANS = '/fonts/geist-600.ttf'
const MONO = '/fonts/geist-mono-500.ttf'
const LIFT = 1.1
const MAX_SPEED = 28
const PAGES = '#F3ECDD'

type BodyRef = React.RefObject<RapierRigidBody | null>

type Drag = {
  id: number
  body: RapierRigidBody
  pointerId: number
  x0: number
  y0: number
  downAt: number
  moved: boolean
  plane: THREE.Plane
  offset: THREE.Vector3
  height: number
}

export default function Scene({ blocks, bounds, shake, active, onBlockClick }: Props) {
  return (
    <Canvas
      shadows='percentage'
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 30, near: 0.5, far: 200, position: [0, 12, 20] }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping
      }}
    >
      <Rig bounds={bounds} />
      <Lights />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 8, 6]} scale={[14, 5, 1]} />
        <Lightformer
          intensity={1.2}
          position={[-9, 3, 0]}
          rotation-y={Math.PI / 2}
          scale={[12, 3, 1]}
        />
        <Lightformer
          intensity={1.4}
          color='#ffd2a6'
          position={[9, 3, -2]}
          rotation-y={-Math.PI / 2}
          scale={[12, 3, 1]}
        />
      </Environment>

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <shadowMaterial transparent opacity={0.18} color='#3d2a12' />
      </mesh>

      <Suspense fallback={null}>
        <Physics gravity={[0, -24, 0]} paused={!active}>
          <World key={`${bounds.w}:${bounds.d}`} bounds={bounds} />
          <Pile blocks={blocks} bounds={bounds} shake={shake} onBlockClick={onBlockClick} />
        </Physics>
      </Suspense>
    </Canvas>
  )
}

// Frames the play area so the pile always fills the width and sits in the
// lower part of the screen, leaving the top for the headline.
function Rig({ bounds }: { bounds: Bounds }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)

  useLayoutEffect(() => {
    const aspect = size.width / size.height
    const portrait = aspect < 1
    const halfV = THREE.MathUtils.degToRad(camera.fov / 2)
    const halfH = Math.atan(Math.tan(halfV) * aspect)
    const dist = (bounds.w + 0.4) / Math.tan(halfH)
    const elev = THREE.MathUtils.degToRad(portrait ? 56 : 48)
    const target = new THREE.Vector3(0, dist * (portrait ? 0.1 : 0.155), -bounds.d * 0.1)

    camera.position.set(0, target.y + Math.sin(elev) * dist, target.z + Math.cos(elev) * dist)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  }, [camera, size, bounds])

  return null
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[5, 16, 9]}
        intensity={2.1}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-bias={-0.0004}
        shadow-radius={6}
      />
    </>
  )
}

function World({ bounds: { w, d } }: { bounds: Bounds }) {
  return (
    <RigidBody type='fixed' colliders={false}>
      <CuboidCollider args={[60, 0.5, 60]} position={[0, -0.5, 0]} friction={0.9} />
      <CuboidCollider args={[0.5, 40, d + 1]} position={[-w - 0.5, 40, 0]} />
      <CuboidCollider args={[0.5, 40, d + 1]} position={[w + 0.5, 40, 0]} />
      <CuboidCollider args={[w + 1, 40, 0.5]} position={[0, 40, -d - 0.5]} />
      <CuboidCollider args={[w + 1, 40, 0.5]} position={[0, 40, d + 0.5]} />
    </RigidBody>
  )
}

function Pile({ blocks, bounds, shake, onBlockClick }: Omit<Props, 'active'>) {
  const bodies = useRef(new Map<number, BodyRef>())
  const drag = useRef<Drag | null>(null)
  const ndc = useRef(new THREE.Vector2())
  const hit = useMemo(() => new THREE.Vector3(), [])
  const camera = useThree((s) => s.camera)
  const raycaster = useThree((s) => s.raycaster)
  const gl = useThree((s) => s.gl)

  const clickRef = useRef(onBlockClick)
  useEffect(() => {
    clickRef.current = onBlockClick
  }, [onBlockClick])

  // Follow the pointer outside the canvas too, and stop the page from
  // scrolling while a finger is holding a block.
  useEffect(() => {
    const el = gl.domElement
    const setNdc = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      ndc.current.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      )
    }
    const onMove = (e: PointerEvent) => {
      const d = drag.current
      if (!d || e.pointerId !== d.pointerId) return
      setNdc(e)
      if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > 6) d.moved = true
    }
    const onUp = (e: PointerEvent) => {
      const d = drag.current
      if (!d || e.pointerId !== d.pointerId) return
      drag.current = null
      document.body.style.cursor = ''
      if (!d.moved && performance.now() - d.downAt < 400) {
        hop(d.body, 7)
        clickRef.current(d.id)
      }
    }
    const blockTouch = (e: TouchEvent) => {
      if (drag.current) e.preventDefault()
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    el.addEventListener('touchstart', blockTouch, { passive: false })
    el.addEventListener('touchmove', blockTouch, { passive: false })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      el.removeEventListener('touchstart', blockTouch)
      el.removeEventListener('touchmove', blockTouch)
    }
  }, [gl])

  useEffect(() => {
    if (!shake) return
    bodies.current.forEach((ref) => {
      const b = ref.current
      if (!b) return
      const m = b.mass()
      b.applyImpulse(
        {
          x: (Math.random() - 0.5) * 6 * m,
          y: (7 + Math.random() * 7) * m,
          z: (Math.random() - 0.5) * 4 * m
        },
        true
      )
      b.applyTorqueImpulse(
        {
          x: (Math.random() - 0.5) * 2.4 * m,
          y: (Math.random() - 0.5) * 2.4 * m,
          z: (Math.random() - 0.5) * 2.4 * m
        },
        true
      )
    })
  }, [shake])

  useFrame(() => {
    const d = drag.current
    if (d) {
      raycaster.setFromCamera(ndc.current, camera)
      if (raycaster.ray.intersectPlane(d.plane, hit)) {
        const tx = THREE.MathUtils.clamp(hit.x - d.offset.x, -bounds.w + 0.6, bounds.w - 0.6)
        const tz = THREE.MathUtils.clamp(hit.z - d.offset.z, -bounds.d + 0.4, bounds.d - 0.4)
        const p = d.body.translation()
        const v = new THREE.Vector3(tx - p.x, d.height - p.y, tz - p.z).multiplyScalar(16)
        v.clampLength(0, MAX_SPEED)
        d.body.setLinvel(v, true)
        const av = d.body.angvel()
        d.body.setAngvel({ x: av.x * 0.85, y: av.y * 0.85, z: av.z * 0.85 }, true)
      }
    }

    // Anything that escapes the play area (resize, wild flings) gets dropped back in.
    bodies.current.forEach((ref) => {
      const b = ref.current
      if (!b) return
      const p = b.translation()
      if (p.y < -4 || Math.abs(p.x) > bounds.w + 2 || Math.abs(p.z) > bounds.d + 2) {
        b.setTranslation({ x: (Math.random() - 0.5) * bounds.w, y: 10, z: 0 }, true)
        b.setLinvel({ x: 0, y: 0, z: 0 }, true)
      }
    })
  })

  const startDrag = (e: ThreeEvent<PointerEvent>, id: number) => {
    const body = bodies.current.get(id)?.current
    if (!body || drag.current) return
    e.stopPropagation()
    const p = body.translation()
    const grab = e.point.clone()
    drag.current = {
      id,
      body,
      pointerId: e.pointerId,
      x0: e.nativeEvent.clientX,
      y0: e.nativeEvent.clientY,
      downAt: performance.now(),
      moved: false,
      // drag on a plane slightly above the grab point so the block lifts but
      // stays under the cursor
      plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -(grab.y + LIFT)),
      offset: new THREE.Vector3(grab.x - p.x, 0, grab.z - p.z),
      height: p.y + LIFT
    }
    ndc.current.copy(e.pointer)
    document.body.style.cursor = 'grabbing'
  }

  return (
    <>
      {blocks.map((spec) => (
        <Body
          key={spec.id}
          spec={spec}
          register={(ref) => {
            if (ref) bodies.current.set(spec.id, ref)
            else bodies.current.delete(spec.id)
          }}
          onDown={startDrag}
          onHover={(on) => {
            if (!drag.current) document.body.style.cursor = on ? 'grab' : ''
          }}
        />
      ))}
    </>
  )
}

function hop(body: RapierRigidBody, strength: number) {
  const m = body.mass()
  body.applyImpulse({ x: 0, y: strength * m, z: 0 }, true)
  body.applyTorqueImpulse(
    {
      x: (Math.random() - 0.5) * m,
      y: (Math.random() - 0.5) * 2 * m,
      z: (Math.random() - 0.5) * m
    },
    true
  )
}

function Body({
  spec,
  register,
  onDown,
  onHover
}: {
  spec: BlockSpec
  register: (ref: BodyRef | null) => void
  onDown: (e: ThreeEvent<PointerEvent>, id: number) => void
  onHover: (on: boolean) => void
}) {
  const ref = useRef<RapierRigidBody>(null)
  const [w, h, d] = spec.size

  const registerRef = useRef(register)
  useEffect(() => {
    const reg = registerRef.current
    reg(ref)
    return () => reg(null)
  }, [])

  return (
    <RigidBody
      ref={ref}
      colliders={false}
      position={spec.position}
      rotation={spec.rotation}
      linearDamping={0.2}
      angularDamping={0.35}
      canSleep
    >
      <CuboidCollider args={[w / 2, h / 2, d / 2]} friction={0.75} restitution={0.12} />
      <group
        onPointerDown={(e) => onDown(e, spec.id)}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(true)
        }}
        onPointerOut={() => onHover(false)}
      >
        {spec.kind === 'book' ? <BookMesh spec={spec} /> : <CardMesh spec={spec} />}
      </group>
    </RigidBody>
  )
}

function CardMesh({ spec }: { spec: BlockSpec }) {
  const [w, h, d] = spec.size
  return (
    <>
      <RoundedBox
        args={[w, h, d]}
        radius={Math.min(0.09, h / 2.4)}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={spec.color}
          roughness={0.48}
          clearcoat={0.55}
          clearcoatRoughness={0.3}
        />
      </RoundedBox>
      {(['top', 'bottom'] as const).map((side) => (
        <Face key={side} side={side} h={h}>
          <Text
            font={MONO}
            fontSize={0.08}
            letterSpacing={0.08}
            color={spec.ink}
            fillOpacity={0.72}
            anchorX='left'
            anchorY='top'
            position={[-w / 2 + 0.15, d / 2 - 0.15, 0]}
          >
            {spec.tag}
          </Text>
          <Text
            font={SANS}
            fontSize={0.18}
            lineHeight={1.08}
            letterSpacing={-0.02}
            maxWidth={w - 0.3}
            color={spec.ink}
            anchorX='left'
            anchorY='bottom'
            position={[-w / 2 + 0.15, -d / 2 + 0.15, 0]}
          >
            {spec.title}
          </Text>
        </Face>
      ))}
    </>
  )
}

// A hardcover: two boards, a spine and a cream page block that's a touch smaller.
function BookMesh({ spec }: { spec: BlockSpec }) {
  const [w, h, d] = spec.size
  const board = 0.045
  const pad = 0.16

  return (
    <>
      <mesh position={[0.02, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[w - 0.06, h - board * 2, d - 0.08]} />
        <meshStandardMaterial color={PAGES} roughness={0.95} />
      </mesh>
      {[1, -1].map((s) => (
        <RoundedBox
          key={s}
          args={[w, board, d]}
          radius={0.02}
          smoothness={2}
          position={[0, s * (h / 2 - board / 2), 0]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial color={spec.color} roughness={0.62} clearcoat={0.25} />
        </RoundedBox>
      ))}
      <RoundedBox
        args={[board * 1.4, h, d]}
        radius={0.02}
        smoothness={2}
        position={[-w / 2 + board * 0.7, 0, 0]}
        castShadow
      >
        <meshPhysicalMaterial color={spec.color} roughness={0.62} clearcoat={0.25} />
      </RoundedBox>

      {(['top', 'bottom'] as const).map((side) => (
        <Face key={side} side={side} h={h}>
          <Text
            font={MONO}
            fontSize={0.075}
            letterSpacing={0.08}
            color={spec.ink}
            fillOpacity={0.75}
            anchorX='left'
            anchorY='top'
            position={[-w / 2 + pad, d / 2 - pad, 0]}
          >
            {spec.tag}
          </Text>
          <Text
            font={SANS}
            fontSize={0.165}
            lineHeight={1.08}
            letterSpacing={-0.02}
            maxWidth={w - pad * 2}
            color={spec.ink}
            anchorX='left'
            anchorY='bottom'
            position={[-w / 2 + pad, -d / 2 + pad + 0.16, 0]}
          >
            {spec.title}
          </Text>
          {spec.author && (
            <Text
              font={MONO}
              fontSize={0.07}
              maxWidth={w - pad * 2}
              color={spec.ink}
              fillOpacity={0.75}
              anchorX='left'
              anchorY='bottom'
              position={[-w / 2 + pad, -d / 2 + pad, 0]}
            >
              {spec.author.toUpperCase()}
            </Text>
          )}
        </Face>
      ))}

      <Text
        font={SANS}
        fontSize={Math.min(0.12, h * 0.42)}
        maxWidth={d - 0.3}
        color={spec.ink}
        anchorX='center'
        anchorY='middle'
        position={[-w / 2 - 0.003, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        whiteSpace='nowrap'
        clipRect={[-(d - 0.3) / 2, -h / 2, (d - 0.3) / 2, h / 2]}
      >
        {spec.title}
      </Text>
    </>
  )
}

function Face({
  side,
  h,
  children
}: {
  side: 'top' | 'bottom'
  h: number
  children: React.ReactNode
}) {
  const top = side === 'top'
  return (
    <group
      position={[0, top ? h / 2 + 0.006 : -h / 2 - 0.006, 0]}
      rotation={[top ? -Math.PI / 2 : Math.PI / 2, 0, 0]}
    >
      {children}
    </group>
  )
}
