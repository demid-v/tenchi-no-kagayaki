"use client";

import * as React from "react";
import { Vector4 } from "three";
import * as THREE from "three";

import { flip } from "~/helpers/utils";
import fragmentShader from "~/templates/shader/glsl/star-flares.frag";
import vertexShader from "~/templates/shader/glsl/star.vert";

export const StarFlaresShader = ({
  pixels = 100.0,
  rotationSpeed = 0.1,
  rotation = 0.0,
  stormWidth = 0.2,
  stormDitherWidth = 0.07,
  circleAmount = 2.0,
  circleScale = 1.0,
  scale = 1.0,
  size = 2.0,
  tiles = 1.0,
  octaves = 4,
  shouldDither = true,
  seed = flip() ? Math.random() * 10 : Math.random() * 100,
  time = 0.0,
  ref,
}: {
  pixels?: number;
  rotationSpeed?: number;
  rotation?: number;
  stormWidth?: number;
  stormDitherWidth?: number;
  circleAmount?: number;
  circleScale?: number;
  scale?: number;
  size?: number;
  tiles?: number;
  octaves?: number;
  shouldDither?: boolean;
  seed?: number;
  time?: number;
  ref?: React.Ref<THREE.ShaderMaterial>;
}) => {
  const colorPalette = [new Vector4(1, 0.647, 0), new Vector4(1, 1, 0.894118)];

  const shaderOptions = {
    uniforms: {
      pixels: { value: pixels },
      time_speed: { value: rotationSpeed },
      rotation: { value: rotation },
      colors: { value: colorPalette },
      storm_width: { value: stormWidth },
      storm_dither_width: { value: stormDitherWidth },
      circle_amount: { value: circleAmount },
      circle_scale: { value: circleScale },
      scale: { value: scale },
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
