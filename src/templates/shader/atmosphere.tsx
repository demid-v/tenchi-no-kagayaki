"use client";

import * as React from "react";
import { useMemo } from "react";
import { Vector4 } from "three";
import * as THREE from "three";

import fragmentShader from "~/templates/shader/glsl/atmosphere.frag";
import vertexShader from "~/templates/shader/glsl/planet.vert";

export const AtmosphereShader = ({
  pixels = 100,
  colors,
  ref,
}: {
  ref?: React.Ref<THREE.ShaderMaterial>;
  pixels?: number;
  colors?: Vector4[];
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(173 / 255, 216 / 255, 230 / 255, 0.25),
        new Vector4(0 / 255, 127 / 255, 255 / 255, 0.35),
        new Vector4(0 / 255, 0 / 255, 128 / 255, 0.45),
      ];

  const materialOptions = useMemo(
    () => ({
      uniforms: {
        pixels: { value: pixels },
        color: { value: colorPalette[0] },
        color2: { value: colorPalette[1] },
        color3: { value: colorPalette[2] },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    }),
    [],
  );

  return <shaderMaterial ref={ref} {...materialOptions} />;
};
