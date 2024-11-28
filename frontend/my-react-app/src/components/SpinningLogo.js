import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const RotatingLogo = () => {
  const logoRef = useRef();
  
  // Load the custom logo texture
  const texture = useTexture('/logo9.png'); // Assuming the image is in the public folder

  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.y += .05; // Adjust the speed of rotation as needed
    }
  });

  return (
    <mesh ref={logoRef} position={[1, 0, 0]}> {/* Adjust position slightly by changing these values */}
      <planeGeometry args={[3, 3]} /> {/* Adjust args to change the size */}
      <meshStandardMaterial map={texture} transparent={true} />
    </mesh>
  );
};

const SpinningLogo = () => {
  return (
    <Canvas className="spinning-logo-canvas">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={false} enableRotate={true} />
    </Canvas>
  );
};

export default SpinningLogo;


