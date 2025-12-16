"use client";

import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/sun-fragment.frag";
import vertexShader from "~/templates/shader/glsl/sun-vertex.vert";

export const SunShader = ({
  pixels = 100.0,
  lightPos = new Vector2(0.39, 0.7),
  colors,
  rotationSpeed = 0.01,
  rotation = 0.0,
  ref,
}: {
  pixels?: number;
  lightPos?: Vector2;
  colors?: THREE.Color[];
  rotationSpeed?: number;
  rotation?: number;
  position?: [number, number, number];
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

  const planetOptions = {
    uniforms: {
      pixels: { value: pixels },
      colors: { value: colorPalette },
      lightIntensity: { value: 0.1 },
      light_origin: { value: lightPos },
      time_speed: { value: rotationSpeed },
      rotation: { value: rotation },
      seed: { value: flip() ? Math.random() * 10 : Math.random() * 100 },
      time: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...planetOptions} />;
};
