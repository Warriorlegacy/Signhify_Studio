import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, PresentationControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Scene3D } from "./Scene3D";

function LaptopMesh({ accentColor = "#ff7a2a" }: { accentColor?: string }) {
  const laptopRef = useRef<THREE.Group>(null);
  const codeLinesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (laptopRef.current) {
      // Gentle automatic sway
      laptopRef.current.rotation.y = Math.sin(t * 0.15) * 0.08;
    }
    if (codeLinesRef.current) {
      // Gentle shifting of code layout overlay
      codeLinesRef.current.position.y = Math.sin(t * 0.5) * 0.02;
    }
  });

  return (
    <group ref={laptopRef} position={[0, -0.4, 0]}>
      {/* Base of laptop (glassmorphic metal) */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[3.2, 0.08, 2.2]} />
        <meshPhysicalMaterial
          color="#161624"
          metalness={0.7}
          roughness={0.2}
          transmission={0.3}
          thickness={1.5}
          ior={1.4}
          clearcoat={1.0}
        />
      </mesh>
      {/* Trackpad marker */}
      <mesh position={[0, -0.005, 0.4]}>
        <boxGeometry args={[0.7, 0.001, 0.45]} />
        <meshBasicMaterial color="#ffffff" opacity={0.08} transparent />
      </mesh>

      {/* Screen Hinge */}
      <group position={[0, 0, -1.05]} rotation={[0.2, 0, 0]}>
        {/* Screen Frame */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[3.2, 2.0, 0.06]} />
          <meshPhysicalMaterial
            color="#0b0b14"
            metalness={0.8}
            roughness={0.15}
            transmission={0.4}
            thickness={1.0}
            ior={1.5}
            clearcoat={1.0}
          />
        </mesh>

        {/* Interactive Viewport Screen */}
        <mesh position={[0, 1, 0.031]}>
          <planeGeometry args={[3.0, 1.8]} />
          <meshPhysicalMaterial
            color="#08080f"
            roughness={0.1}
            metalness={0.1}
            transmission={0.8}
            thickness={0.5}
          />
        </mesh>

        {/* Viewport content glow / background grid */}
        <mesh position={[0, 1, 0.032]}>
          <planeGeometry args={[2.98, 1.78]} />
          <meshBasicMaterial color={accentColor} opacity={0.12} transparent />
        </mesh>

        {/* Decorative layout blocks inside viewport */}
        <group ref={codeLinesRef} position={[0, 1, 0.034]}>
          {/* Header Mock */}
          <mesh position={[-1.1, 0.7, 0]}>
            <planeGeometry args={[0.5, 0.08]} />
            <meshBasicMaterial color="#ffffff" opacity={0.25} transparent />
          </mesh>
          <mesh position={[1.1, 0.7, 0]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
          </mesh>

          {/* Hero Section Mock */}
          <mesh position={[0, 0.2, 0]}>
            <planeGeometry args={[1.8, 0.12]} />
            <meshBasicMaterial color="#ffffff" opacity={0.4} transparent />
          </mesh>
          <mesh position={[0, 0.0, 0]}>
            <planeGeometry args={[1.2, 0.06]} />
            <meshBasicMaterial color={accentColor} opacity={0.5} transparent />
          </mesh>

          {/* Code columns mock */}
          {Array.from({ length: 5 }).map((_, idx) => (
            <mesh key={idx} position={[-0.9, -0.3 - idx * 0.08, 0]}>
              <planeGeometry args={[0.4 + (idx % 2 === 0 ? 0.3 : 0.1), 0.03]} />
              <meshBasicMaterial color="#ffffff" opacity={0.2} transparent />
            </mesh>
          ))}

          {/* 3D Mock Widget */}
          <mesh position={[0.7, -0.3, 0]} rotation={[0, 0.3, 0.2]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshBasicMaterial color={accentColor} wireframe />
          </mesh>
        </group>
      </group>
    </group>
  );
}

interface ThreeDDevicePreviewProps {
  accentColor?: string;
  className?: string;
}

export function ThreeDDevicePreview({
  accentColor = "#ff7a2a",
  className = "w-full h-full min-h-[350px] relative",
}: ThreeDDevicePreviewProps) {
  return (
    <div className={className}>
      <Scene3D
        className="absolute inset-0"
        cameraPosition={[0, 0.2, 3.8]}
        cameraFov={45}
        frameloop="always"
        disableOnMobile={false}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 8, 5]} intensity={1.5} />
        <pointLight position={[-4, 4, 3]} intensity={1.2} color={accentColor} />
        <pointLight position={[4, -4, 2]} intensity={0.8} color="#fcd34d" />

        <PresentationControls
          global
          
          snap
          rotation={[0.1, -0.2, 0]}
          polar={[-Math.PI / 12, Math.PI / 6]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
        >
          <Float speed={2.0} rotationIntensity={0.15} floatIntensity={0.4}>
            <LaptopMesh accentColor={accentColor} />
          </Float>
        </PresentationControls>

        <ContactShadows position={[0, -1.0, 0]} opacity={0.3} scale={6} blur={2.0} far={1.5} />
      </Scene3D>
    </div>
  );
}
