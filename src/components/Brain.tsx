import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Brain() {
  const pointsCount = 5000;
  const maxDistance = 0.8;

  const { points, lines, randoms } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const rnds: number[] = [];
    
    while (pts.length < pointsCount) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 16;

      const nx = x / 6.0;
      const ny = y / 5.0;
      const nz = z / 7.0;

      const w = 1.0 + nz * 0.2 - nz * nz * 0.1;
      const adjNx = nx / w;
      const adjNy = ny > 0 ? ny : ny * 1.2;
      const dCerebrum = adjNx * adjNx + adjNy * adjNy + nz * nz;

      const cbX = (Math.abs(nx) - 0.25) / 0.4;
      const cbY = (ny + 0.75) / 0.4;
      const cbZ = (nz - 0.6) / 0.4;
      const dCerebellum = cbX * cbX + cbY * cbY + cbZ * cbZ;

      const bsX = nx / 0.2;
      const bsY = (ny + 1.0) / 0.5;
      const bsZ = (nz - 0.3) / 0.2;
      const dBrainStem = bsX * bsX + bsY * bsY + bsZ * bsZ;

      if (dCerebrum < 1.0 || dCerebellum < 1.0 || dBrainStem < 1.0) {
        pts.push(new THREE.Vector3(x, y, z));
        rnds.push(Math.random());
      }
    }

    const lns: THREE.Vector3[] = [];
    const maxDistSq = maxDistance * maxDistance;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceToSquared(pts[j]) < maxDistSq) {
          lns.push(pts[i], pts[j]);
        }
      }
    }

    return { points: pts, lines: lns, randoms: rnds };
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const pointsGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const linesGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(lines), [lines]);

  const baseColors = useMemo(() => {
    const cols = new Float32Array(points.length * 3);
    const color = new THREE.Color();
    for (let i = 0; i < points.length; i++) {
      color.setHSL(0.85 + Math.random() * 0.1, 0.8, 0.5);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return cols;
  }, [points]);

  const colors = useMemo(() => {
    return new THREE.BufferAttribute(new Float32Array(baseColors), 3);
  }, [baseColors]);

  pointsGeometry.setAttribute('color', colors);

  const hoverPoint = useRef<THREE.Vector3 | null>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current && linesRef.current) {
      pointsRef.current.rotation.y = time * 0.1;
      linesRef.current.rotation.y = time * 0.1;

      const positions = pointsGeometry.attributes.position.array as Float32Array;
      const currentColors = pointsGeometry.attributes.color.array as Float32Array;
      
      let localHover: THREE.Vector3 | null = null;
      if (hoverPoint.current) {
        localHover = hoverPoint.current.clone();
        pointsRef.current.worldToLocal(localHover);
      }

      for (let i = 0; i < points.length; i++) {
        const i3 = i * 3;
        const orig = points[i];
        const r = randoms[i];
        
        positions[i3] = orig.x + Math.sin(time * 2 + r * 100) * 0.05;
        positions[i3 + 1] = orig.y + Math.cos(time * 2.5 + r * 100) * 0.05;
        positions[i3 + 2] = orig.z + Math.sin(time * 3 + r * 100) * 0.05;
        
        let intensity = 0.5 + ((Math.sin(time * 4 + r * 50) + 1) * 0.5) * 0.8;
        
        if (localHover) {
          const dist = orig.distanceTo(localHover);
          if (dist < 3) {
            intensity += (3 - dist) * 1.5;
          }
        }
        
        currentColors[i3] = Math.min(1, baseColors[i3] * intensity);
        currentColors[i3 + 1] = Math.min(1, baseColors[i3 + 1] * intensity);
        currentColors[i3 + 2] = Math.min(1, baseColors[i3 + 2] * intensity);
      }
      
      pointsGeometry.attributes.position.needsUpdate = true;
      pointsGeometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group>
      <mesh 
        onPointerMove={(e) => { hoverPoint.current = e.point; }}
        onPointerOut={() => { hoverPoint.current = null; }}
      >
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial 
          size={0.1} 
          vertexColors 
          transparent 
          opacity={0.8} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={linesGeometry}>
        <lineBasicMaterial 
          color="#ff1493" 
          transparent 
          opacity={0.1} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
