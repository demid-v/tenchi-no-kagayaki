"use client";

import * as React from "react";
import { Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/star-flares-fragment.frag";
import vertexShader from "~/templates/shader/glsl/star-vertex.vert";

export const StarFlaresShader = ({
  pixels = 100.0,
  rotationSpeed = 0.1,
  rotation = 0.0,
  ref,
}: {
  pixels?: number;
  rotationSpeed?: number;
  rotation?: number;
  position?: [number, number, number];
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = [new Vector4(1, 0.647, 0), new Vector4(1, 1, 0.894118)];

  const planetOptions = {
    uniforms: {
      pixels: { value: pixels },
      colors: { value: colorPalette },
      time_speed: { value: rotationSpeed },
      rotation: { value: rotation },
      seed: { value: flip() ? Math.random() * 10 : Math.random() * 100 },
      time: { value: 0.0 },
      storm_width: { value: 0.2 },
      storm_dither_width: { value: 0.07 },
      circle_amount: { value: 2.0 },
      circle_scale: { value: 1.0 },
      scale: { value: 1.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  };

  return <shaderMaterial ref={ref} {...planetOptions} />;
};
