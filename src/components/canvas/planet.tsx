"use client";

import { useLoader } from "@react-three/fiber";
import { useImperativeHandle, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

import { getRandom } from "~/helpers/utils";
import {
  Planet as PlanetMaterial,
  type PlanetShaderUni,
} from "~/templates/shader/planet";

export const Planet = ({
  position,
  ref,
  planetShaderUni,
  ...props
}: {
  position: [number, number, number];
  planetShaderUni?: PlanetShaderUni;
  ref?: React.RefObject<THREE.Mesh | null>;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useImperativeHandle(ref, () => meshRef.current!);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const geometry = meshRef.current.geometry;
    geometry.computeTangents();
  }, []);

  return (
    <mesh ref={meshRef} position={position} {...props}>
      <sphereGeometry args={[1, 128, 128]} />
      <PlanetMaterial {...planetShaderUni} />
    </mesh>
  );
};

export const ParadisePlanet = ({
  position,
  ref,
}: {
  position: [number, number, number];
  ref?: React.RefObject<THREE.Mesh | null>;
}) => {
  const period = getRandom(0.3, 2);
  const permutation = Math.floor(getRandom(19, 370));

  return (
    <Planet
      ref={ref}
      position={position}
      planetShaderUni={{
        period,
        permutation,
      }}
    />
  );
};

export const LavaPlanet = ({
  position,
  ref,
}: {
  position: [number, number, number];
  ref?: React.RefObject<THREE.Mesh | null>;
}) => {
  const sharpness = getRandom(1.6, 3.6);
  const offset = getRandom(-0.036, 0.016);
  const permutation = Math.floor(getRandom(19, 370));

  return (
    <Planet
      ref={ref}
      position={position}
      planetShaderUni={{
        permutation,
        sharpness,
        offset,
        color1: [0.9, 0.27, 0.22],
        color2: [0.32, 0.2, 0.25],
        color3: [0.24, 0.16, 0.21],
        color4: [0.32, 0.2, 0.25],
        color5: [0.56, 0.3, 0.34],
      }}
    />
  );
};

export const IcePlanet = ({
  position,
  ref,
}: {
  position: [number, number, number];
  ref?: React.RefObject<THREE.Mesh | null>;
}) => {
  const sharpness = getRandom(1.6, 3.6);
  const offset = getRandom(0.1, 0.3);
  const permutation = Math.floor(getRandom(19, 370));

  return (
    <Planet
      ref={ref}
      position={position}
      planetShaderUni={{
        permutation,
        sharpness,
        offset,
        color1: [0.31, 0.64, 0.72],
        color2: [0.3, 0.41, 0.52],
        color3: [0.98, 1, 1],
        color4: [0.98, 1, 1],
        color5: [0.98, 1, 1],
      }}
    />
  );
};

export const Star = ({ position }: { position: [number, number, number] }) => {
  const glowMap = useLoader(TextureLoader, "/img/glow.png");

  return (
    <>
      <mesh position={position}>
        <sphereGeometry args={[60, 128, 128]} />
        <meshStandardMaterial emissive={"yellow"} emissiveIntensity={10} />
      </mesh>
      <mesh position={position}>
        <sprite scale={[600, 600, 1]}>
          <spriteMaterial
            color={0x0000ff}
            map={glowMap}
            transparent={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </mesh>
    </>
  );
};
