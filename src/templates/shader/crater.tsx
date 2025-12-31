"use client";

import * as React from "react";
import { useMemo } from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/crater.frag";
import vertexShader from "~/templates/shader/glsl/crater.vert";

export const CraterShader = ({
  pixels = 100,
  lightPosition = new Vector2(0.39, 0.7),
  rotationSpeed = 0.1,
  rotation = 0.0,
  colors,
  lightBorder = 0.4,
  size = 5.0,
  octaves = 20,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0.0,
  ref,
}: {
  pixels?: number;
  lightPosition?: Vector2;
  rotation?: number;
  rotationSpeed?: number;
  lightBorder?: number;
  colors?: Vector4[];
  size?: number;
  octaves?: number;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(71 / 255, 97 / 255, 124 / 255, 1),
        new Vector4(53 / 255, 57 / 255, 85 / 255, 1),
      ];

  const shaderOptions = useMemo(
    () => ({
      uniforms: {
        pixels: { value: pixels },
        rotation: { value: rotation },
        light_origin: { value: lightPosition },
        time_speed: { value: rotationSpeed },
        light_border: { value: lightBorder },
        colors: { value: colorPalette },
        size: { value: size },
        OCTAVES: { value: octaves },
        seed: { value: seed },
        time: { value: time },
      },
      vertexShader,
      fragmentShader,
      depthTest: true,
      transparent: true,
    }),
    [],
  );

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};
