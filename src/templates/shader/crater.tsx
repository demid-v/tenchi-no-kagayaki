"use client";

import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/crater-fragment.frag";
import vertexShader from "~/templates/shader/glsl/crater-vertex.vert";

export const CraterShader = ({
  pixels = 100.0,
  lightPos = new Vector2(0.39, 0.7),
  colors,
  rotationSpeed = 0.1,
  rotation = 0.0,
  ref,
}: {
  pixels?: number;
  lightPos?: Vector2;
  colors?: [Vector4, Vector4];
  rotationSpeed?: number;
  rotation?: number;
  position?: [number, number, number];
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(71 / 255, 97 / 255, 124 / 255, 1),
        new Vector4(53 / 255, 57 / 255, 85 / 255, 1),
      ];

  const shaderOptions = {
    uniforms: {
      pixels: { value: pixels },
      color1: { value: colorPalette[0] },
      color2: { value: colorPalette[1] },
      light_origin: { value: lightPos },
      time_speed: { value: rotationSpeed },
      rotation: { value: rotation },
      seed: { value: flip() ? Math.random() * 10 : Math.random() * 100 },
      time: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    depthTest: true,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};
