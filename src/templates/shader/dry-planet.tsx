"use client";

import * as React from "react";
import { Vector2, Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/dry-terrain.frag";
import vertexShader from "~/templates/shader/glsl/planet.vert";

export const DryPlanetShader = ({
  pixels = 100.0,
  lightPosition = new Vector2(0.39, 0.7),
  rotation = 0.0,
  rotationSpeed = 0.1,
  lightDistance1 = 0.362,
  lightDistance2 = 0.525,
  ditherSize = 2.0,
  colors,
  numOfColors = 5,
  size = 8.0,
  octaves = 3,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0.0,
  shouldDither = true,
  ref,
}: {
  pixels?: number;
  lightPosition?: Vector2;
  rotation?: number;
  rotationSpeed?: number;
  lightDistance1?: number;
  lightDistance2?: number;
  ditherSize?: number;
  colors?: Vector4[];
  numOfColors?: number;
  size?: number;
  octaves?: number;
  seed?: number;
  time?: number;
  shouldDither?: boolean;
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
      rotation: { value: rotation },
      colors: { value: colorPalette },
      light_origin: { value: lightPosition },
      light_distance1: { value: lightDistance1 },
      light_distance2: { value: lightDistance2 },
      time_speed: { value: rotationSpeed },
      dither_size: { value: ditherSize },
      n_colors: { value: numOfColors },
      size: { value: size },
      OCTAVES: { value: octaves },
      seed: { value: seed },
      time: { value: time },
      should_dither: { value: shouldDither },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...shaderOptions} />;
};
