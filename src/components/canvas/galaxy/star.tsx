"use client";

import { useAtom, useSetAtom } from "jotai";
import React, { useMemo, useRef, useState } from "react";
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
  const starRef = useRef<THREE.ShaderMaterial>(null);

  const scale = useMemo(() => getRandom(1, 4), []);
  const [scene, setScene] = useAtom(sceneAtom);

  const shaderOptions = useMemo(
    () =>
      ({
        uniforms: {
          time: { value: 0 },
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

  const [sceneScale, setSceneScale] = useState(scale);

  return (
    <group
      {...props}
      ref={groupRef}
      scale={[sceneScale, sceneScale, 1]}
      onPointerEnter={() => {
        if (!starRef.current) return;

        starRef.current.uniforms.brightness!.value = 2;
        setSceneScale((scale) => scale * 1.5);
      }}
      onPointerLeave={() => {
        if (!starRef.current) return;

        starRef.current.uniforms.brightness!.value = 1;
        setSceneScale(scale);
      }}
      onClick={() => {
        if (scene !== "galaxy") return;

        setCurrentStar(starId);
        setScene("starSystem");
      }}
    >
      <mesh>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial ref={starRef} {...shaderOptions} />
      </mesh>
    </group>
  );
};

export default Star;
