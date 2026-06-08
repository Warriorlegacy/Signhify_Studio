import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Scene3D } from "./Scene3D";
import { EmberField } from "./EmberField";

/**
 * Drop-in immersive 3D layer for the hero. Sits behind the UI and
 * adds a slow-tumbling glass orb plus a particle ember field with
 * additive glow. ~2 draw calls total.
 */
function GlassOrb() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const rotationStart = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const t = state.clock.elapsedTime;

    if (!isDragging) {
      // Smoothly drift towards cursor pointer position
      const targetX = state.pointer.x * 0.4;
      const targetY = state.pointer.y * 0.4;

      // Outer wireframe rotates slightly faster and tracks cursor
      outer.rotation.x += (targetY - outer.rotation.x) * 0.05 + dragVelocity.current.y;
      outer.rotation.y += (targetX - outer.rotation.y) * 0.05 + 0.005;

      // Inner core rotates in opposite direction and tracks cursor with lag
      inner.rotation.x += (-targetY - inner.rotation.x) * 0.03 - dragVelocity.current.y;
      inner.rotation.y += (-targetX - inner.rotation.y) * 0.03 - 0.003;

      // Apply drag inertia decay
      dragVelocity.current.x *= 0.95;
      dragVelocity.current.y *= 0.95;
    } else {
      // Decay velocity while holding but keep update
      dragVelocity.current.x *= 0.8;
      dragVelocity.current.y *= 0.8;
    }

    // Gentle floating motion
    outer.position.y = Math.sin(t * 0.5) * 0.15;
    inner.position.y = Math.sin(t * 0.5) * 0.15;
  });

  return (
    <group>
      {/* Outer Wireframe Shell */}
      <mesh
        ref={outerRef}
        position={[0, 0, 0]}
        onPointerDown={(e) => {
          if (e.button !== 0) return; // Only left click drag
          setIsDragging(true);
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          pointerStart.current = { x: e.clientX, y: e.clientY };
          rotationStart.current = {
            x: outerRef.current?.rotation.x || 0,
            y: outerRef.current?.rotation.y || 0,
          };
        }}
        onPointerUp={(e) => {
          setIsDragging(false);
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!isDragging || !outerRef.current) return;
          const deltaX = e.clientX - pointerStart.current.x;
          const deltaY = e.clientY - pointerStart.current.y;

          const nextX = rotationStart.current.x + deltaY * 0.005;
          const nextY = rotationStart.current.y + deltaX * 0.005;

          dragVelocity.current = {
            x: (nextY - outerRef.current.rotation.y) * 0.1,
            y: (nextX - outerRef.current.rotation.x) * 0.1,
          };

          outerRef.current.rotation.x = nextX;
          outerRef.current.rotation.y = nextY;
        }}
        
      >
        <icosahedronGeometry args={[1.7, 1]} />
        <meshPhysicalMaterial
          color="#ff7a2a"
          metalness={0.4}
          roughness={0.15}
          transmission={0.7}
          thickness={1.5}
          ior={1.45}
          emissive="#ff5500"
          emissiveIntensity={0.45}
          wireframe
        />
      </mesh>

      {/* Inner Core Solid Glass */}
      <mesh ref={innerRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[1.1, 2]} />
        <meshPhysicalMaterial
          color="#fcd34d"
          metalness={0.2}
          roughness={0.2}
          transmission={0.85}
          thickness={2.2}
          ior={1.5}
          emissive="#ffaa00"
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
}

export function CinematicHero3D() {
  return (
    <Scene3D
      className="absolute inset-0 pointer-events-none"
      cameraPosition={[0, 0, 6]}
      cameraFov={50}
      frameloop="always"
      ariaLabel="Cinematic ember atmosphere"
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2.5} color="#ff7a2a" />
      <pointLight position={[-5, -3, 2]} intensity={1.2} color="#fcd34d" />
      <GlassOrb />
      <EmberField count={500} />
      <fog attach="fog" args={["#0a0a14", 6, 14]} />
    </Scene3D>
  );
}
