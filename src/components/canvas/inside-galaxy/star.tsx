"use client";

import React, { useMemo, useRef, useState } from "react";
import { EllipseCurve } from "three";
import * as THREE from "three";

import useUpdate from "~/helpers/use-update";
import { getRandom } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/galaxy-star.frag";
import vertexShader from "~/templates/shader/glsl/stars.vert";

import { randomizeColors } from "../star";

const InsideGalaxy = (props: React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);
  const size = useMemo(() => getRandom(10, 40), []);

  const color = useMemo(() => randomizeColors().star.at(2), []);

  const [showTarget, setShowTarget] = useState(false);

  const curve = new EllipseCurve(0, 0, size, size, 0, 2 * Math.PI, false, 0);

  const points = curve.getPoints(50);

  const positionsLength = points.length * 3;

  const positions = points.reduce((acc, p, i) => {
    const idx = i * 3;

    acc[idx] = p.x;
    acc[idx + 1] = p.y;
    acc[idx + 2] = -1;

    return acc;
  }, new Float32Array(positionsLength));

  const shaderOptions = useMemo(
    () => ({
      uniforms: {
        time: { value: 0.0 },
        size: { value: 0.06 },
        color: { value: color },
        brightness: { value: 1.5 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    }),
    [],
  );

  useUpdate(groupRef);

  return (
    <group
      {...props}
      onPointerEnter={() => setShowTarget(true)}
      onPointerLeave={() => setShowTarget(false)}
    >
      <mesh visible={showTarget}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            attach="material"
            color="white"
            linewidth={1}
            toneMapped={false}
          />
        </line>
      </mesh>
      <group ref={groupRef} scale={[size, size, 0]}>
        <mesh>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial {...shaderOptions} />
        </mesh>
      </group>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

export default InsideGalaxy;
