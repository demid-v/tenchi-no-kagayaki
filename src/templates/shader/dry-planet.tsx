"use client";

import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/dry-terrain-fragment.frag";
import vertexShader from "~/templates/shader/glsl/planet-vertex.vert";

export const DryPlanetShader = ({
  pixels = 100.0,
  lightPos = new Vector2(0.39, 0.7),
  colors,
  rotationSpeed = 0.1,
  rotation = 0.0,
  ref,
}: {
  pixels?: number;
  lightPos?: Vector2;
  colors?: [Vector4, Vector4, Vector4, Vector4, Vector4];
  rotationSpeed?: number;
  rotation?: number;
  position?: [number, number, number];
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = colors
    ? colors
    : [
        new Vector4(1, 0.537255, 0.2, 1),
        new Vector4(0.901961, 0.270588, 0.223529, 1),
        new Vector4(0.678431, 0.184314, 0.270588, 1),
        new Vector4(0.321569, 0.2, 0.247059, 1),
        new Vector4(0.239216, 0.160784, 0.211765, 1),
      ];

  const shaderOptions = {
    uniforms: {
      pixels: { value: pixels },
      colors: { value: colorPalette },
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

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};
