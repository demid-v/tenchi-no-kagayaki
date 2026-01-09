"use client";

import { useAtom, useSetAtom } from "jotai";
import React, { useMemo, useRef, useState } from "react";
import { EllipseCurve } from "three";
import * as THREE from "three";

import { currentStarSystemIdAtom, sceneAtom } from "~/helpers/store";
import useUpdate from "~/helpers/use-update";
import { getRandom } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/galaxy-star.frag";
import vertexShader from "~/templates/shader/glsl/galaxy-star.vert";

const Star = ({
  color,
  starId,
  ...props
}: {
  color: THREE.Vector4;
  starId: number;
} & React.ComponentProps<"group">) => {
  const groupRef = useRef<THREE.Group>(null);
  const scale = useMemo(() => getRandom(1, 4), []);

  const [showTarget, setShowTarget] = useState(false);

  const [scene, setScene] = useAtom(sceneAtom);

  const curve = new EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI, false, 0);

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
    () =>
      ({
        uniforms: {
          time: { value: 0.0 },
          color: { value: color },
          brightness: { value: 1.5 },
          seed: { value: getRandom(6, 10) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
      }) satisfies THREE.ShaderMaterialParameters,
    [],
  );

  useUpdate(groupRef);

  const setCurrentStar = useSetAtom(currentStarSystemIdAtom);

  return (
    <group
      {...props}
      ref={groupRef}
      scale={[scale, scale, 0]}
      onPointerEnter={() => setShowTarget(true)}
      onPointerLeave={() => setShowTarget(false)}
      onClick={() => {
        if (scene !== "galaxy") return;

        setCurrentStar(starId);
        setScene("starSystem");
      }}
    >
      <mesh>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial {...shaderOptions} />
      </mesh>
      <group visible={showTarget}>
        <mesh>
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
      </group>
    </group>
  );
};

export default Star;
