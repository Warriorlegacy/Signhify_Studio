import { useRef } from "react";
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
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.rotation.x = Math.sin(t * 0.15) * 0.4;
    m.rotation.y = t * 0.1;
    m.position.x = Math.sin(t * 0.2) * 0.3;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.6, 1]} />
      <meshPhysicalMaterial
        color="#ff6b00"
        metalness={0.2}
        roughness={0.15}
        transmission={0.85}
        thickness={1.2}
        ior={1.4}
        emissive="#ff6b00"
        emissiveIntensity={0.35}
        wireframe
      />
    </mesh>
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
