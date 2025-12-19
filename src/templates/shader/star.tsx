"use client";

import * as React from "react";
import { Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/star.frag";
import vertexShader from "~/templates/shader/glsl/star.vert";

export const StarShader = ({
  pixels = 100.0,
  rotationSpeed = 0.01,
  rotation = 0.0,
  colors,
  size = 15.0,
  octaves = 2.0,
  tiles = 5,
  shouldDither = true,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0.0,
  ref,
}: {
  pixels?: number;
  colors?: Vector4[];
  lightIntensity?: number;
  rotationSpeed?: number;
  rotation?: number;
  size?: number;
  octaves?: number;
  tiles?: number;
  shouldDither?: boolean;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(0.961, 1, 0.91),
        new Vector4(1, 0.847, 0.196),
        new Vector4(1, 0.51, 0.231),
        new Vector4(0.486, 0.098, 0.102),
      ];

  const shaderOptions = {
    uniforms: {
      pixels: { value: pixels },
      colors: { value: colorPalette },
      time_speed: { value: rotationSpeed },
      rotation: { value: rotation },
      size: { value: size },
      TILES: { value: tiles },
      OCTAVES: { value: octaves },
      shoul_dither: { value: shouldDither },
      seed: { value: seed },
      time: { value: time },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};
