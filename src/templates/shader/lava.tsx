"use client";

import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/lava.frag";
import vertexShader from "~/templates/shader/glsl/planet.vert";

const LavaShader = ({
  pixels = 100.0,
  lightPosition = new Vector2(0.3, 0.3),
  rotation = 0.0,
  rotationSpeed = 0.2,
  lightBorder1 = 0.019,
  lightBorder2 = 0.036,
  riverCutoff = 0.579,
  colors,
  size = 10.0,
  octaves = 4,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0.0,
  ref,
}: {
  pixels?: number;
  lightPosition?: Vector2;
  rotation?: number;
  rotationSpeed?: number;
  lightBorder1?: number;
  lightBorder2?: number;
  riverCutoff?: number;
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
        new Vector4(1, 0.537255, 0.2, 1),
        new Vector4(0.901961, 0.270588, 0.223529, 1),
        new Vector4(0.678431, 0.184314, 0.270588, 1),
      ];

  const shaderOptions = {
    uniforms: {
      pixels: { value: pixels },
      rotation: { value: rotation },
      light_origin: { value: lightPosition },
      time_speed: { value: rotationSpeed },
      light_border_1: { value: lightBorder1 },
      light_border_2: { value: lightBorder2 },
      river_cutoff: { value: riverCutoff },
      colors: { value: colorPalette },
      size: { value: size },
      OCTAVES: { value: octaves },
      seed: { value: seed },
      time: { value: time },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};

export default LavaShader;
