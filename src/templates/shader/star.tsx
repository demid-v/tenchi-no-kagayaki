"use client";

import * as React from "react";
import { Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/star-fragment.frag";
import vertexShader from "~/templates/shader/glsl/star-vertex.vert";

export const StarShader = ({
  pixels = 100.0,
  colors,
  rotationSpeed = 0.01,
  rotation = 0.0,
  ref,
}: {
  pixels?: number;
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
